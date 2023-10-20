from flask import Flask, request, render_template, jsonify, send_file
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