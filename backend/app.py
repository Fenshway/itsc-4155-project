from flask import Flask, request, render_template, jsonify, send_file, flash
import os
import base64
from io import BytesIO
from dotenv import load_dotenv
from flask_cors import CORS
from models.model import UserImage, User, db

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
db.init_app(app) # Initialize the Database

with app.app_context():
    db.create_all()

CORS(app)

@app.route('/')
def index():
    from models.model import User
    print(User.query.all()) # Test [] when empty. This is how a query would be run from inside a Flask instance
    return render_template('index.html')

#json user object. keys = username, email, password1, password2. Path used for account registration
@app.route('/register', methods=['POST'])
def register():
    user = request.get_json()

    userName = user.get('username')
    print(userName)
    email = user.get('email')
    password1 = user.get('password1')
    password2 = user.get('password2')

    # Verify the username/email doesn't exsist or that the passwords match.
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
    elif password1 != password2:
        flash('Passwords don\'t match', category='error')
    elif len(password1) < 7:
        flash('Passwords must be at least 7 characters long', category='error')
    else:
        # This is how it get's passed to the DataBase
        new_user = User(user_name=userName, email=email, user_password=password1)
        db.session.add(new_user)
        db.session.commit()
        flash('Account Created and added to the DataBase!', category='success')

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