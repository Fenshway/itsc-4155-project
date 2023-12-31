from functools import wraps
from flask import Flask, request, render_template, jsonify, send_file, flash
import os
import base64
from io import BytesIO
from dotenv import load_dotenv
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, decode_token
from flask_socketio import SocketIO, emit, join_room
from datetime import timedelta
from sqlalchemy import column, func
from models.model import UserImage, User, db, Games, Lobby, Lobby_Players, User_games, Friends, UserRating
from flask_mail import Mail, Message

load_dotenv()

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
db.init_app(app) # Initialize the Database

app.config['MAIL_SERVER'] = "smtp.gmail.com"
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'quest.owner1@gmail.com'
app.config['MAIL_PASSWORD'] = 'qghc tpzy tylg bhmu'
mail = Mail(app)

with app.app_context():
    db.create_all()

CORS(app)

bcrypt = Bcrypt(app)

app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET')
jwt = JWTManager(app)

# Expiration for jwt
expires = timedelta(days=365)

@app.route('/')
def index():
    from models.model import User
    print(User.query.all()) # Test [] when empty. This is how a query would be run from inside a Flask instance
    return render_template('index.html')

#Authentication middleware
def authMiddleware(callback):

    @wraps(callback)
    def decoratedFunction(*args, **kwargs):
        
        auth_token = request.headers.get("Authorization")
        if not auth_token:
            return jsonify({'error': "Authentication failed"}), 400
        
        decoded_token = None
        try:
            decoded_token = decode_token(auth_token)
        except:
           return jsonify({'error': "Authentication failed"}), 400
        
        user = User.query.filter_by(user_name=decoded_token.get("username")).first()
        setattr(request, "user", user)

        return callback(*args, **kwargs)
    
    return decoratedFunction
        

#json user object. keys = username, email, password. Path used for account registration
@app.route('/api/register', methods=['POST'])
def register():
    user = request.get_json()

    username = user.get('username')
    email = user.get('email')
    password = user.get('password')

    hashed_bytes = bcrypt.generate_password_hash(password, int(os.getenv('BCRYPT_ROUNDS')))
    hashed_password = hashed_bytes.decode('utf-8')

    # Verify the username/email doesn't exsist.
    existing_email = User.query.filter_by(email=email).first()
    # Compares lowercase to lowercase
    existing_user = User.query.filter(func.lower(User.user_name) == func.lower(username)).first()

    if existing_email:
        return jsonify({'error': "Email already exists"}), 400
    elif username == 'system' or username == 'System':
        return jsonify({'error': "Username is reserved"}), 400
    elif existing_user:
        return jsonify({'error': "Username is taken"}), 400
    else:
        # This is how it gets passed to the DataBase
        new_user = User(user_name=username, email=email, user_password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        user_data = {
            'user_id': new_user.user_id,
            'username': new_user.user_name,
        }
        access_token = create_access_token(identity=new_user.user_name, additional_claims=user_data, expires_delta=expires)
        return jsonify({'access_token': access_token}), 200

#user login
@app.route('/api/login', methods=['POST'])
def login():
    
    user = request.get_json()

    username = user.get('username')
    password = user.get('password')

    existing_user = User.query.filter_by(user_name=username).first()

    if not existing_user:
        return jsonify({'error': "Error logging in. Please check username and password"}), 400
    elif not bcrypt.check_password_hash(existing_user.user_password, password):
        return jsonify({'error': "Error logging in. Please check username and password"}), 400
    else: 
        user_data = {
            'user_id': existing_user.user_id,
            'username': existing_user.user_name,
        }
        access_token = create_access_token(identity=existing_user.user_name, additional_claims=user_data, expires_delta=expires)
        return jsonify({'access_token': access_token}), 200

# Testing for Image Upload
# TODO: Add a way to display upoaded image
# Can fetch uploaded image with: UserImage.query.filter_by(filename=file.filename).first()
@app.route('/testImage', methods=['GET', 'POST'])
def testImage():
    if request.method == 'POST':
        file = request.files['file']
        adminID = User.query.filter_by(user_name='Admin').first()
        upload = UserImage(user_id=adminID.user_id, data=file.read(), filename=file.filename)
        db.session.add(upload)
        db.session.flush()
        db.session.commit()
        # TODO Once the image has been uploaded, you can fetch it with the following code:
        image = UserImage.query.filter_by(user_id=(adminID.user_id)).first().data
        return f'Uploaded: {file.filename}'
    return render_template('fetchImage.html')

@app.route('/api/profile/<username>', methods=['GET'])
@authMiddleware
def getProfile(username):

    user = getattr(request, "user")

    #Retrieving user data
    requestedUser = User.query.filter_by(user_name=username).first_or_404()
    userGamesQuery = User_games.query.filter_by(user_id=requestedUser.user_id).all() or []
    userGames = []
    for query in userGamesQuery:
        userGames.append(query.game_id)
        
    imageByteString = UserImage.query.filter_by(user_id=requestedUser.user_id).first()
    image = ""
    
    if(imageByteString):
        image = base64.b64encode(imageByteString.data).decode("UTF-8")

    #Determining relationship status
    #0 = none
    #1 = pending; route requester -> profile user
    #2 = pending; profile user -> route requester
    #3 = friends
    #4 = blocked; route requester -> profile user
    #5 = blocked; profile user -> route requester
    #6 = blocked; route requester <-> profile user
    outgoingRelationshipData = Friends.query.filter_by(user_id = user.user_id, friend_id = requestedUser.user_id).first()
    incomingRelationshipData = Friends.query.filter_by(user_id = requestedUser.user_id, friend_id = user.user_id).first()
    relationship = 0

    if incomingRelationshipData and outgoingRelationshipData and incomingRelationshipData.relationship_stat == 4 and outgoingRelationshipData.relationship_stat == 4:
        relationship = 6

    elif outgoingRelationshipData:
        relationship = outgoingRelationshipData.relationship_stat
        
    elif incomingRelationshipData:
        if incomingRelationshipData.relationship_stat == 1:
            relationship = 2
        elif incomingRelationshipData.relationship_stat == 4:
            relationship = 5
    
    #Determining rating vote
    vote = UserRating.query.filter_by(judge_id=user.user_id, user_id=requestedUser.user_id).first()
    
    user_data = {
        'user_id': requestedUser.user_id,
        'username': requestedUser.user_name,
        'icon': image,
        'rating': requestedUser.user_rating or 0,
        'library': userGames,
        'relationship': relationship,
        'status': requestedUser.user_status,
        'rateChange': vote and vote.rateChange or 0,
    }
    
    return jsonify(user_data)

def getFriends(user_id):
    
    userFriendsQuery = Friends.query.filter_by(user_id=user_id, relationship_stat=3).all() or []
    userFriends = []
    
    for query in userFriendsQuery:
        friendData = User.query.filter_by(user_id=query.friend_id).first()
        userFriends.append({
            'username': friendData.user_name,
            'status': friendData.user_status,
        })

    return userFriends
    

@app.route('/api/relationship', methods = ['POST', 'GET'])
@authMiddleware
def handleRelationships():
    
    user = getattr(request, "user")

    if request.method == 'POST':
        #relationshipId note:
        #0 = none
        #1 = pending; route requester -> profile user
        #2 = pending; profile user -> route requester
        #3 = friends
        #4 = blocked; route requester -> profile user
        #5 = blocked; profile user -> route requester
        #6 = blocked; route requester <-> profile user

        #Data validation
        data = request.form
        receieverId = int(data.get('user_id'))
        relationshipId = int(data.get('relationship'))
        
        if receieverId == None or relationshipId == None:
            return jsonify({})

        existingOutgoingRequest = Friends.query.filter_by(user_id = user.user_id, friend_id = receieverId).first()
        existingIncomingRequest = Friends.query.filter_by(user_id = receieverId, friend_id = user.user_id).first()
        hasExistingRelationship = existingIncomingRequest != None or existingOutgoingRequest != None
        hasMutualRelationship = existingIncomingRequest != None and existingOutgoingRequest != None
        hasNoRelationship = existingIncomingRequest == None and existingOutgoingRequest == None
        success = False
        
        if relationshipId == 0:
            
            #Unfriend operation
            if hasMutualRelationship and existingOutgoingRequest.relationship_stat == 3 and existingIncomingRequest.relationship_stat == 3:
                db.session.delete(existingOutgoingRequest)
                db.session.delete(existingIncomingRequest)
                db.session.flush()
                db.session.commit()
                success = True
            
            #Unblock operation
            elif hasExistingRelationship and existingOutgoingRequest and existingOutgoingRequest.relationship_stat == 4:
                db.session.delete(existingOutgoingRequest)
                db.session.flush()
                db.session.commit()
                success = True

        elif relationshipId == 1 and hasNoRelationship: #Send friend request operation
            newRequest = Friends(user_id=user.user_id, friend_id=receieverId, relationship_stat=1)
            db.session.add(newRequest)
            db.session.flush()
            db.session.commit()
            success = True

        elif relationshipId == 3: #Accept friend request operation
            if existingOutgoingRequest == None and existingIncomingRequest != None and existingIncomingRequest.relationship_stat == 1:
                existingIncomingRequest.relationship_stat = 3
                newRequest = Friends(user_id=user.user_id, friend_id=receieverId, relationship_stat=3)
                db.session.add(newRequest)
                db.session.flush()
                db.session.commit()
                success = True
        
        elif relationshipId == 4: #Block operation
            
            #Delete incoming request if it exists (and isn't a block)
            if existingIncomingRequest and existingIncomingRequest.relationship_stat != 4:
                db.session.delete(existingIncomingRequest)

            #Delete outgoing request if it exists
            if existingOutgoingRequest:
                db.session.delete(existingOutgoingRequest)

            newRequest = Friends(user_id=user.user_id, friend_id=receieverId, relationship_stat=4)
            db.session.add(newRequest)
            db.session.flush()
            db.session.commit()
            success = True

        if success:
            return jsonify({'success': 1})
        else:
            return jsonify({})
        
    elif request.method == 'GET':
        
        return jsonify({
            'friends': getFriends(user.user_id),
        })

#Used for updating profile status
@app.route('/api/profileUpdate/status', methods=['POST'])
@authMiddleware
def updateStatus():

    #StatusIds:
    #0 = online
    #1 = invisible/offline
    #2 = do not disturb
    #3 = idle

    user = getattr(request, "user")
    
    if not user:
        return jsonify({})
    
    #Data validation
    data = request.form
    status = int(data.get('status'))
    
    if status == None or not status in [0, 1, 2, 3]:
        return jsonify({})
    
    user.user_status = status
    db.session.commit()

    return jsonify({'success': 1})

#Used for updating profile icon
@app.route('/api/profileUpdate/profileIcon', methods=['POST'])
@authMiddleware
def updateProfileIcon():
    
    #Checking if file is valid
    if not 'file' in request.files:
        return jsonify({})

    file = request.files['file']
    mimetype = file.content_type
    
    if not mimetype in ['image/png', 'image/jpeg']:
        return jsonify({})
    
    user = getattr(request, "user")
    
    if not user:
        return jsonify({})
    
    #Deleting any existing file
    existingFile = UserImage.query.filter_by(user_id=user.user_id).first()
    if existingFile:
        db.session.delete(existingFile)

    #Uploading file
    upload = UserImage(user_id=user.user_id, filename=file.filename, data=file.read())
    db.session.add(upload)

    #Database commit
    db.session.flush()
    db.session.commit()
    
    imageByteString = UserImage.query.filter_by(user_id=(user.user_id)).first().data
    image = base64.b64encode(imageByteString).decode("UTF-8")

    return jsonify({
        'icon': image,
    })

#Used for updating profile game library
@app.route('/api/profileUpdate/library', methods=['POST'])
@authMiddleware
def updateProfileLibrary():
    
    #Data validation
    data = request.form
    gameId = int(data.get('gameId'))
    action = int(data.get('action'))
    
    if gameId == None or action == None:
        return jsonify({})
    
    user = getattr(request, "user")

    if not user:
        return jsonify({})
    
    #Updating library
    existingLibraryGame = User_games.query.filter_by(user_id=user.user_id, game_id=gameId).first()
    if action == 1:
        
        if existingLibraryGame:
            return jsonify({})

        #Adding to library
        newLibraryGame = User_games(user_id=user.user_id, game_id=gameId)
        db.session.add(newLibraryGame)

        #Database commit
        db.session.flush()
        db.session.commit()

        return jsonify({
            'success': 1,
        })

    elif action == 0:
        if not existingLibraryGame:
            return jsonify({})

        #Removing from library
        db.session.delete(existingLibraryGame)

        #Database commit
        db.session.flush()
        db.session.commit()

        return jsonify({
            'success': 1,
        })

    return jsonify({})

#Gets array of all game objects from database
@app.route('/api/games', methods=['GET'])
def get_games_library():
    games = Games.query.all()
    game_library = [{'game_id': game.game_id, 'game_name': game.game_name, 'img_path': game.img_path} for game in games]
    return jsonify (game_library)

# Creates lobby
@app.route('/api/create-lobby', methods=['POST'])
def create_lobby():
    lobby = request.get_json()

    lobby_title = lobby.get('title')
    lobby_game = lobby.get('game')
    lobby_description = lobby.get('description')
    lobby_size = lobby.get('lobbySize')
    host_id = lobby.get('userId')
    private_lobby = lobby.get('privateLobby')

    # Get game ID based on name
    game = Games.query.filter_by(game_name=lobby_game).first()
    if game is None:
        return jsonify({'error': "Invalid game name"}), 400
    
    #FOR LATER USE
    '''
    lobbyExists = Lobby.query.filter_by(host_id=host_id).first()
    if lobbyExists:
        return jsonify({'error': "User may only host one lobby at a time"}), 400
    '''

    new_lobby = Lobby(
        game_id=game.game_id,
        host_id=host_id,
        title=lobby_title,
        num_players=lobby_size,
        description=lobby_description,
        priv=private_lobby
    )

    db.session.add(new_lobby)
    db.session.commit()
    
    db.session.refresh(new_lobby)
    new_LPlayer = Lobby_Players(lobby_id=new_lobby.lobby_id, players_id=host_id)

    db.session.add(new_LPlayer)
    db.session.commit()
    
    response_data = {'lobby_id': new_lobby.lobby_id, 'message': "Lobby created successfully"}
    return jsonify(response_data), 201

# Join lobby
@app.route('/api/join-lobby', methods=['POST'])
@authMiddleware
def join_lobby():
    lobbyJoin = request.get_json()
    lobby_id = lobbyJoin.get('lobbyId')
    lobby_access_key = lobbyJoin.get('privateLobby')
    print(lobby_access_key)

    user = getattr(request, "user")

    #Checks db to see if user is in a lobby 
    existing_player = Lobby_Players.query.filter_by(players_id=user.user_id).first()
    if existing_player:
        return jsonify({'error': 'User is already in a lobby'}), 400
    
    #Checking open space in lobby
    lobby = Lobby.query.filter_by(lobby_id=lobby_id).first()

    if lobby.priv == True and lobby_access_key == False:
        return jsonify({'error': 'Lobby is private'}), 400

    players_in_lobby = len(set(player.players_id for player in lobby.players))
    if players_in_lobby >= lobby.num_players:
        return jsonify({'error': 'Lobby is full'}), 400
    

    new_LPlayer = Lobby_Players(lobby_id=lobby_id, players_id=user.user_id)

    db.session.add(new_LPlayer)
    db.session.commit()

    # Notify socket.io server that user is joining lobby
    socketio.emit('join', {'room': lobby_id, 'username': user.user_name}, room=lobby_id)
    
    return jsonify({'message': "Lobby joined successfully"}), 201

# Leave lobby
@app.route('/api/leave-lobby', methods=['POST'])
def leave_lobby():
    lobbyLeave = request.get_json()
    lobby_id = lobbyLeave.get('lobbyToLeave')

    auth_token = request.headers.get("Authorization")
    decoded_token = decode_token(auth_token)
    user = User.query.filter_by(user_name=decoded_token.get("username")).first()
    
    # Get the lobby_id based on the title and host_id matching
    lobby = Lobby.query.filter_by(lobby_id=lobby_id).first()

    if lobby:
        # Notify socket.io server that user is leaving lobby
        socketio.emit('leave', {'room': lobby_id, 'username': user.user_name}, room=lobby_id)

        # Delete the user from Lobby_Players
        Lobby_Players.query.filter_by(lobby_id=lobby.lobby_id, players_id=user.user_id).delete()
        db.session.commit()

        # If host leaves, delete Lobby too
        if lobby.host_id == user.user_id:
            # Deletes the players in lobby
            Lobby_Players.query.filter_by(lobby_id=lobby.lobby_id).delete()
            db.session.commit()
            # Deletes the lobby
            Lobby.query.filter_by(lobby_id=lobby.lobby_id, host_id=user.user_id).delete()
            db.session.commit()
    
        return jsonify({'message': "Lobby left successfully"}), 201
    else:
        return jsonify({'error': "Lobby not found"}), 404

# Using lobby_id retrieves and sends lobby information and players
@app.route('/api/get-lobby-by-id', methods=['POST'])
def get_lobby():
    requested_lobby = request.get_json()
    lobby_id = requested_lobby.get('requestedLobby')

    lobby = Lobby.query.filter_by(lobby_id=lobby_id).first()

    if lobby is None:
        return jsonify({'error': "Cannot locate lobby"}), 400

    send_lobby = {
        'lobby_id': lobby.lobby_id,
        'game_id': lobby.game_id,
        'host_id': lobby.host_id,
        'title': lobby.title,
        'num_players': lobby.num_players,
        'description': lobby.description,
        'date': lobby.date.isoformat()
    }

    # Gets the host's username
    host = User.query.get(lobby.host_id)
    send_lobby['host'] = host.user_name
    
    lobby_players = Lobby_Players.query.filter_by(lobby_id=lobby_id).all()
    user_ids = [lobby_player.players_id for lobby_player in lobby_players]
    users = User.query.filter(User.user_id.in_(user_ids)).all()

    # Add usernames and ratings to the lobby_info dict
    user_info = [{'username': user.user_name, 'rating': user.user_rating} for user in users]
    send_lobby['players'] = user_info

    return jsonify({'lobby': send_lobby, 'message': "Joined lobby successfully"})


@app.route('/api/get-lobbies-by-name', methods=['POST'])
def get_lobbies_by_name():
    requested_lobbies = request.get_json()
    game_name = requested_lobbies.get('requestedLobbies')
    print("game name: ", game_name)
    formatted_game_name = game_name.replace("-", " ")
    print("game name: ", formatted_game_name)

    game = Games.query.filter(func.lower(Games.game_name) == formatted_game_name).first()

    if game: 
        lobbies = Lobby.query.filter_by(game_id=game.game_id).all()

        lobbies_list = [
            {
                'lobby_id': lobby.lobby_id,
                'game_id': lobby.game_id,
                'host_id': lobby.host_id,
                'num_players': lobby.num_players,
                'title': lobby.title,
                'description': lobby.description,
                'date': lobby.date.isoformat(),
                'num_players_in_lobby': len(set(player.players_id for player in lobby.players))
            }
            for lobby in lobbies
        ]

        return jsonify(lobbies_list), 201
    else:
        return jsonify({'message': "Game not found"}), 400
    
# Finds lobby id so the user can navigate to the lobby that they are in
@app.route('/api/get-my-lobby', methods=['GET'])
def get_my_lobby():
    auth_token = request.headers.get("Authorization")
    decoded_token = decode_token(auth_token)
    user = User.query.filter_by(user_name=decoded_token.get("username")).first()

    existing_player = Lobby_Players.query.filter_by(players_id=user.user_id).first()

    if existing_player:
        lobby_id = existing_player.lobby_id
        return jsonify({'lobbyId': lobby_id}), 200
    else :
        return jsonify({'message': 'User is not in a lobby'}), 200

# Endpoint to set userservice if JWT in storage
@app.route('/api/whoami', methods=['GET'])
@authMiddleware
def whoami():
    user = getattr(request, "user")
    
    user_data = {
        'user_id': user.user_id,
        'username': user.user_name,
    }

    return jsonify(user_data)   

# Endpoint to see if user is in lobby
@app.route('/api/in-lobby', methods=['GET'])
@authMiddleware
def in_lobby():
    print('hi')
    user = getattr(request, "user")

    # Check if the user is in the lobby
    existing_player = Lobby_Players.query.filter_by(players_id=user.user_id).first()

    if existing_player is not None:
        return jsonify({'response': 'true'})
    else:
        return jsonify({'response': 'false'})

# Transfers the rates to the respective user in the DB
@app.route('/api/rating', methods=['POST'])
@authMiddleware
def post_rating():
    
    user = getattr(request, "user")

    if(not user):
        return jsonify({})
    
    #Data validation
    data = request.form
    ratedUser_id = int(data.get('user_id'))
    rating = int(data.get('vote'))
    if not ratedUser_id or rating == None or rating not in [0, 1, -1]:
        return jsonify({})

    host_id = user.user_id

    # Checks if the rating was already done by user A on user B
    existingRating = UserRating.query.filter_by(judge_id=host_id, user_id=ratedUser_id).first()
    hostUser = User.query.filter_by(user_id=host_id).first()

    if not hostUser.can_rate():
        return jsonify({'error': "Must wait 5 minutes bofore rating another user"}), 400

    success = False
    if existingRating:
        if existingRating.rateChange != rating:
            db.session.delete(existingRating)
            db.session.flush()
            db.session.commit()

            if rating != 0:
                new_rating = UserRating(judge_id=host_id, user_id=ratedUser_id, rateChange=rating)
                db.session.add(new_rating)
                db.session.commit()
            
            success = True
    elif rating != 0:
        new_rating = UserRating(judge_id=host_id, user_id=ratedUser_id, rateChange=rating)
        db.session.add(new_rating)
        db.session.commit()
        success = True

    if success:
        response_data = {'success': 1, 'message': "Rating processed"}
        return jsonify(response_data), 201
    else:
        return jsonify({'error': "Error updating rating"}), 400
    
@app.route('/api/send-help-message', methods = ['GET','POST'])
def contact_page():
    print('hi')
    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email')
        message = data.get('message')
        print(email, message)
        msg = Message('Form Submission from Quest help center',
                  sender = 'quest.owner1@gmail.com',
                  recipients = ['jprivet6@uncc.edu'])

    msg.body = """
    Message from the forum:

    From: {email}

    The message is:
    {message}
    """.format(email = email, message = message)
    mail.send(msg)

    return jsonify({"message": "Thank you {email}! Your message has been submitted to the admin"})
    
@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('join')
def handle_join(data):
    lobby = data['lobby']
    username = data['username']

    join_room(lobby)

    # Notify others in the room that a user has joined
    emit('message', {'username': 'System', 'message': f'{username} has joined the lobby.'}, room=lobby)

@socketio.on('message')
def handle_message(data):
    print('socket io received')
    lobby = data['lobby']
    username = data['username']
    message = data['message']

    print(f'Received message in lobby {lobby} from {username}: {message}')

    emit('message', {'username': username, 'message': message}, room=lobby)

if __name__ == '__main__':
    socketio.run(app, debug=True)
