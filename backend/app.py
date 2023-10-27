from flask import Flask, request, render_template, jsonify, send_file, flash
import os
import base64
from io import BytesIO
from dotenv import load_dotenv
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, decode_token
from models.model import UserImage, User, db

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
    elif len(email) < 4:
        return jsonify({'error': "Invalid email address"}), 400
    elif existing_user:
        return jsonify({'error': "Username is taken"}), 400
    elif len(username) < 2:
        return jsonify({'error': "Username must be longer than 1 character"}), 400
    else:
        # This is how it gets passed to the DataBase
        new_user = User(user_name=username, email=email, user_password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        imageByteString = UserImage.query.filter_by(user_id=(new_user.user_id)).first()
        image = ""
        if(imageByteString):
            image = base64.b64encode(imageByteString.data).decode("UTF-8")
        user_data = {
            'username': new_user.user_name,
            'icon': image,
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
        return jsonify({'error': "Unable to login"}), 400
    elif not bcrypt.check_password_hash(existing_user.user_password, password):
        return jsonify({'error': "Unable to login"}), 400
    else: 
        imageByteString = UserImage.query.filter_by(user_id=(existing_user.user_id)).first()
        image = ""
        if(imageByteString):
            image = base64.b64encode(imageByteString.data).decode("UTF-8")
        user_data = {
            'username': existing_user.user_name,
            'icon': image,
        }
        access_token = create_access_token(identity=existing_user.user_name, additional_claims=user_data)
        return jsonify({'access_token': access_token}), 200

# testing flask -> angular data
@app.route('/api/testdata', methods=['GET'])
def testdata():
    greetings = 'hello from flask'
    return jsonify(greetings)

# Testing for Image Upload
# TODO: Add a way to display upoaded image
# Can fetch uploaded image with: UserImage.query.filter_by(filename=file.filename).first()
@app.route('/testImage', methods=['GET', 'POST'])
def testImage():
    if request.method == 'POST':
        file = request.files['file']
        adminID = User.query.filter_by(user_name='Admin').first()
        upload = UserImage(user_id=adminID.user_id, filename=file.filename, data=file.read())
        db.session.add(upload)
        db.session.flush()
        db.session.commit()
        # TODO Once the image has been uploaded, you can fetch it with the following code:
        image = UserImage.query.filter_by(user_id=(adminID.user_id)).first().data
        return f'Uploaded: {file.filename}'
    return render_template('fetchImage.html')

@app.route('/api/updateProfileIcon', methods=['POST'])
def updateProfileIcon():
    
    #Checking if file is valid
    if not 'file' in request.files:
        return jsonify({})
    
    #Checking for authentication
    auth_token = request.headers.get("Authorization")
    decoded_token = decode_token(auth_token)
    user = User.query.filter_by(user_name=decoded_token.get("username")).first()
    
    if not user:
        return jsonify({})

    #Uploading file
    file = request.files['file']
    upload = UserImage(user_id=user.user_id, filename=file.filename, data=file.read())
    db.session.add(upload)
    db.session.flush()
    db.session.commit()
    
    imageByteString = UserImage.query.filter_by(user_id=(user.user_id)).first().data
    image = base64.b64encode(imageByteString).decode("UTF-8")

    return jsonify({
        'icon': image,
    })

if __name__ == '__main__':
    app.run(debug=True)