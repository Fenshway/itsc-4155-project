from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func

db = SQLAlchemy()
DB_NAME = "database.db"

class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    user_name = db.Column(db.String(150))
    fav_game_id = db.Column(db.Integer)

class Friends(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    friend_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    relationship = db.Column(db.String)

class Blocked(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    blocked_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))

class Lobby(db.Model):
    lobby_id = db.Column(db.Integer, primary_key=True)
    game_id = db.Comuln(db.Integer)
    host_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    num_players = db.Comuln(db.Integer)
    date = db.Column(db.DateTime(timezone=True), default=func.now())