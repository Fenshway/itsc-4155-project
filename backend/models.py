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
    description = db.Column(db.String(10000))
    date = db.Column(db.DateTime(timezone=True), default=func.now())

class Lobby_Players(db.Model):
    player_1 = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    player_2 = db.Column(db.Integer, db.ForeignKey('user.user_id'), default=None)
    player_3 = db.Column(db.Integer, db.ForeignKey('user.user_id'), default=None)
    player_4 = db.Column(db.Integer, db.ForeignKey('user.user_id'), default=None)
    player_5 = db.Column(db.Integer, db.ForeignKey('user.user_id'), default=None)
    player_6 = db.Column(db.Integer, db.ForeignKey('user.user_id'), default=None)
    player_7 = db.Column(db.Integer, db.ForeignKey('user.user_id'), default=None)
    player_8 = db.Column(db.Integer, db.ForeignKey('user.user_id'), default=None)
    player_9 = db.Column(db.Integer, db.ForeignKey('user.user_id'), default=None)
    player_10 = db.Column(db.Integer, db.ForeignKey('user.user_id'), default=None)