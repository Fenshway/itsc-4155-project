from flask import Flask, request, render_template, jsonify, send_file, flash
import os
import base64
from io import BytesIO
from dotenv import load_dotenv
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, decode_token
from sqlalchemy import column, func
from models.model import UserImage, User, db, Games, Lobby, Lobby_Players, User_games

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
db.init_app(app) # Initialize the Database

with app.app_context():
    db.create_all()

CORS(app)

bcrypt = Bcrypt(app)

app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET')
jwt = JWTManager(app)

@app.route('/')
def index():
    from models.model import User
    print(User.query.all()) # Test [] when empty. This is how a query would be run from inside a Flask instance
    return render_template('index.html')

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
    existing_user = User.query.filter_by(user_name=username).first()

    if existing_email:
        return jsonify({'error': "Email already exists"}), 400
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
        access_token = create_access_token(identity=new_user.user_name, additional_claims=user_data)
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
        access_token = create_access_token(identity=existing_user.user_name, additional_claims=user_data)
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
def getProfile(username):

    user = User.query.filter_by(user_name=username).first_or_404()
    userGamesQuery = User_games.query.filter_by(user_id=user.user_id).all() or []
    userGames = []
    for query in userGamesQuery:
        userGames.append(query.game_id)
        
    imageByteString = UserImage.query.filter_by(user_id=user.user_id).first()
    image = ""
    
    if(imageByteString):
        image = base64.b64encode(imageByteString.data).decode("UTF-8")

    user_data = {
        'username': user.user_name,
        'icon': image,
        'rating': user.user_rating or 0,
        'library': userGames,
    }
    
    return jsonify(user_data)

@app.route('/api/profileUpdate/profileIcon', methods=['POST'])
def updateProfileIcon():
    
    #File upload
    if not 'file' in request.files:
        return jsonify({})

    #Checking if file is valid
    file = request.files['file']
    mimetype = file.content_type
    
    if not mimetype in ['image/png', 'image/jpeg']:
        return jsonify({})
    
    #Checking for authentication
    auth_token = request.headers.get("Authorization")
    decoded_token = decode_token(auth_token)
    user = User.query.filter_by(user_name=decoded_token.get("username")).first()
    
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

@app.route('/api/profileUpdate/library', methods=['POST'])
def updateProfileLibrary():
    
    #Data validation
    data = request.form
    gameId = int(data.get('gameId'))
    action = int(data.get('action'))
    
    if gameId == None or action == None:
        return jsonify({})
    
    #Checking for authentication
    # (TODO: add this check as a middleware for certain routes instead of rewriting multiple times)
    auth_token = request.headers.get("Authorization")
    decoded_token = decode_token(auth_token)
    user = User.query.filter_by(user_name=decoded_token.get("username")).first()

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

@app.route('/api/games', methods=['GET'])
def get_games_library():
    games = Games.query.all()
    game_library = [{'game_id': game.game_id, 'game_name': game.game_name, 'img_path': game.img_path} for game in games]
    return jsonify (game_library)

@app.route('/api/create-lobby', methods=['POST'])
def create_lobby():
    lobby = request.get_json()

    lobby_title = lobby.get('title')
    lobby_game = lobby.get('game')
    lobby_description = lobby.get('description')
    lobby_size = lobby.get('lobbySize')
    host_id = lobby.get('userId')

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
    )

    db.session.add(new_lobby)
    db.session.commit()
    
    db.session.refresh(new_lobby)
    new_LPlayer = Lobby_Players(lobby_id=new_lobby.lobby_id, players_id=host_id)

    db.session.add(new_LPlayer)
    db.session.commit()
    
    response_data = {'lobby_id': new_lobby.lobby_id, 'message': "Lobby created successfully"}
    return jsonify(response_data), 201

#TODO: Fix anything that needs to be added for frontend
@app.route('/api/join-lobby', methods=['POST'])
def join_lobby():
    lobbyJoin = request.get_json()

    lobby_title = lobbyJoin.get('title')
    host_id = lobbyJoin.get('hostId') #ID of the user who is hosting the lobby to be joined
    currUser_id = lobbyJoin.get('userId') #This should be the ID of the user who will be joining
    
    #Get the lobby_id based on the title and host_id matching
    lobby = Lobby.query.filter_by(title=lobby_title, host_id=host_id).first()
    new_LPlayer = Lobby_Players(lobby_id=lobby.lobby_id, players_id=currUser_id)

    db.session.add(new_LPlayer)
    db.session.commit()
    
    return jsonify({'message': "Lobby joined successfully"}), 201

#TODO: Fix anything that needs to be added for frontend
@app.route('/api/leave-lobby', methods=['POST'])
def leave_lobby():
    lobbyLeave = request.get_json()

    lobby_title = lobbyLeave.get('title')
    host_id = lobbyLeave.get('hostId') #ID of the user who is hosting the lobby to be left
    currUser_id = lobbyLeave.get('userId') #This should be the ID of the user who will be leaving
    
    #Get the lobby_id based on the title and host_id matching
    lobby = Lobby.query.filter_by(title=lobby_title, host_id=host_id).first()

    Lobby_Players.query.filter_by(lobby_id=lobby.lobby_id, players_id=currUser_id).delete()
    db.session.commit()

    #If host leaves, delete Lobby too
    if host_id == currUser_id:
        Lobby.query.filter_by(title=lobby_title, host_id=host_id).delete()
        db.session.commit()
    
    return jsonify({'message': "Lobby left successfully"}), 201

#TODO missing lobby players
@app.route('/api/get-lobby', methods=['POST'])
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
        'description': lobby.description
    }

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
                'date': lobby.date.isoformat()
            }
            for lobby in lobbies
        ]

        return jsonify(lobbies_list), 201
    else:
        return jsonify({'message': "Game not found"}), 400

@app.route('/api/whoami', methods=['GET'])
def whoami():
    #Checking for authentication
    auth_token = request.headers.get("Authorization")
    decoded_token = decode_token(auth_token)
    user = User.query.filter_by(user_name=decoded_token.get("username")).first()

    user_data = {
        'user_id': user.user_id,
        'username': user.user_name
    }

    return jsonify(user_data)

if __name__ == '__main__':
    app.run(debug=True)