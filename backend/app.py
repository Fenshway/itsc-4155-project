from flask import Flask, request, render_template, jsonify
import os
from dotenv import load_dotenv
from flask_cors import CORS
from models.model import db

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

    test_data = user.get('username')
    print(test_data)

    response_data = {
        "message": "Data received successfully"
    }
    return jsonify(response_data), 200

# testing flask -> angular data
@app.route('/api/testdata', methods=['GET'])
def testdata():
    greetings = 'hello from flask'
    return jsonify(greetings)

if __name__ == '__main__':
    app.run(debug=True)