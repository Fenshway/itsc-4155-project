from flask import Flask, request, render_template, jsonify, send_file, flash
import os
import base64
from io import BytesIO
from dotenv import load_dotenv
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from models.model import UserImage, User, db

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
db.init_app(app) # Initialize the Database

with app.app_context():
    db.create_all()

CORS(app)

bcrypt = Bcrypt(app)

@app.route('/')
def index():
    from models.model import User
    print(User.query.all()) # Test [] when empty. This is how a query would be run from inside a Flask instance
    return render_template('index.html')

#json user object. keys = username, email, password. Path used for account registration
@app.route('/register', methods=['POST'])
def register():
    user = request.get_json()

    userName = user.get('username')
    print(userName)
    email = user.get('email')
    password = user.get('password')

    hashed_bytes = bcrypt.generate_password_hash(password, int(os.getenv('BCRYPT_ROUNDS')))
    hashed_password = hashed_bytes.decode('utf-8')

    # Verify the username/email doesn't exsist.
    userMail = User.query.filter_by(email=email).first()
    user = User.query.filter_by(user_name=userName).first()

    if userMail:
        flash('Email already exist', category='error')
    elif len(email) < 4:
        flash('Email must be greater than 3 characters', category='error')
    elif user:
        flash('User Namre already exist', category='error')
    elif len(userName) < 2:
        flash('First name must be greater than 1 characters', category='error')
    else:
        # This is how it gets passed to the DataBase
        new_user = User(user_name=userName, email=email, user_password=password)
        db.session.add(new_user)
        db.session.commit()
        flash('Account Created and added to the DataBase!', category='success')

    response_data = {
        "message": "Data received successfully"
    }
    return jsonify(response_data), 200

#user login
@app.route('/login', methods=['POST'])
def login():
    user = request.get_json()

    username = user.get(username)
    password = user.get(password)

    existing_user = User.query.filter_by(user_name=username).first()
    if not existing_user:
        flash('No user name found. Please try again.', category='error') #This is how I passed to the front end as an error, but change it as necessary.

    elif not bcrypt.check_password_hash(existing_user.user_password, password):
        #if they dont match we will get out and pass error to frontend
        flash('Wrong password. Check it and try again', category='error')
        pass

    #still looking how we should pass session back and forth
    response_data = {
        "message": "Data received successfully"
    }
    return jsonify(response_data), 200

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
        return f'Uploaded: {file.filename}'
    return render_template('fetchImage.html')

if __name__ == '__main__':
    app.run(debug=True)