from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func

db = SQLAlchemy()
    
class UserImage(db.Model):
    __tablename__ = 'UserImage'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('User.user_id'))
    filename = db.Column(db.String(50))
    data = db.Column(db.LargeBinary)

    def __init__(self, user_id, filename, data):
        self.user_id = user_id
        self.filename  = filename 
        self.data = data

    def __repr__(self):
        return '<user_id {}>'.format(self.user_id)
    
class User(db.Model):
    __tablename__ = 'User'
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_name = db.Column(db.String(150))
    email = db.Column(db.String(150), unique=True)
    user_password = db.Column(db.String(150))
    user_image = db.relationship('UserImage', cascade='all, delete')
    fav_game_id = db.Column(db.Integer, nullable=True)
    user_rating = db.Column(db.Integer, nullable=False, default=5)

    def __init__(self, email, user_password, user_name, user_rating=5, fav_game_id=None):
        self.user_name = user_name
        self.email = email
        self.user_password = user_password
        self.user_rating = user_rating
        self.fav_game_id = fav_game_id

    def __repr__(self):
        return '<user_name {}>'.format(self.user_name)

class Friends(db.Model):
    __tablename__ = 'Friends'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    friend_id = db.Column(db.Integer, db.ForeignKey('User.user_id'))
    relationship = db.Column(db.String(15))

    def __init__(self, friend_id, relationship):
        self.friend_id = friend_id
        self.relationship = relationship

    def __repr__(self):
        return '<friend_id {}>'.format(self.friend_id)

class Blocked(db.Model):
    __tablename__ = 'Blocked'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    blocked_id = db.Column(db.Integer, db.ForeignKey('User.user_id'))

    def __init__(self, id, blocked_id):
        self.blocked_id = blocked_id 

    def __repr__(self):
        return '<blocked_id  {}>'.format(self.blocked_id )

class Lobby(db.Model):
    __tablename__ = 'Lobby'
    lobby_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    game_id = db.Column(db.Integer)
    host_id = db.Column(db.Integer, db.ForeignKey('User.user_id'))
    num_players = db.Column(db.Integer)
    description = db.Column(db.String(10000))
    date = db.Column(db.DateTime(timezone=True), default=func.now())

    def __init__(self, game_id, host_id, num_players, description, date):
        self.game_id = game_id
        self.host_id = host_id
        self.num_players = num_players
        self.description = description
        self.date = date

    def __repr__(self):
        return '<host_id {}>'.format(self.host_id)

class Lobby_Players(db.Model):
    __tablename__ = 'Lobby_Players'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    lobby_id = db.Column(db.Integer, db.ForeignKey('Lobby.lobby_id'))
    players = db.Column(db.Integer, db.ForeignKey('User.user_id'), nullable=True)

    def __init__(self, id, lobby_id, players=None):
        self.lobby_id = lobby_id 
        self.players = players 

    def __repr__(self):
        return '<lobby_id {}>'.format(self.lobby_id)

class Chat(db.Model):
    __tablename__ = 'Chat'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    lobby_id = db.Column(db.Integer, db.ForeignKey('Lobby.lobby_id'))
    user_id = db.Column(db.Integer, db.ForeignKey('User.user_id'))
    messages = db.Column(db.String(10000))
    time_stamp = db.Column(db.TIMESTAMP, default=func.now())

    def __init__(self, id, lobby_id, user_id, messages, time_stamp):
        self.lobby_id = lobby_id 
        self.user_id = user_id
        self.messages = messages
        self.time_stamp = time_stamp

    def __repr__(self):
        return '<lobby_id {}>'.format(self.lobby_id)
    
from backend.app import app