from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

db = SQLAlchemy()
        
class User(db.Model):
    __tablename__ = 'User'
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_name = db.Column(db.String(150), unique=True)
    email = db.Column(db.String(150), unique=True)
    user_password = db.Column(db.String(150))
    user_rating = db.Column(db.Integer, nullable=True)
    user_status = db.Column(db.Integer, nullable=True)
    date_created = db.Column(db.DateTime(timezone=True), default=func.now())
    user_image = db.relationship('UserImage', backref='user_img', cascade='all, delete, delete-orphan')
    user_games = db.relationship('User_games', backref='user_gam', cascade='all, delete, delete-orphan')

    def __init__(self, email, user_password, user_name, user_rating=0, user_status=0):
        self.user_name = user_name
        self.email = email
        self.user_password = user_password
        self.user_status = user_status
        self.user_rating = user_rating

    def __repr__(self):
        return '<user_name {}>'.format(self.user_name)
    
    def can_rate(self):
        time_since_creation = datetime.now(timezone.utc) - self.date_created
        return time_since_creation.total_seconds() >= 2000

class UserImage(db.Model):
    __tablename__ = 'UserImage'
    user_id = db.Column(db.Integer, db.ForeignKey('User.user_id'), primary_key=True)
    data = db.Column(db.LargeBinary)
    filename = db.Column(db.String(50), nullable=True)

    def __init__(self, user_id, data, filename=None):
        self.user_id = user_id
        self.data = data
        self.filename = filename 

    def __repr__(self):
        return '<user_id {}>'.format(self.user_id)
    
class UserRating(db.Model):
    __tablename__ = 'UserRating'
    judge_id = db.Column(db.Integer, db.ForeignKey('User.user_id'), primary_key=True) # Person giving the vote
    user_id = db.Column(db.Integer, db.ForeignKey('User.user_id'), primary_key=True) # Person reciving the vote
    rateChange = db.Column(db.Integer, nullable=True) # The vote

    def __init__(self, judge_id, user_id, rateChange):
        self.judge_id = judge_id
        self.user_id = user_id
        self.rateChange = rateChange 

    def __repr__(self):
        return '<judge_id {}>'.format(self.judge_id)

class Friends(db.Model):
    __tablename__ = 'Friends'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('User.user_id'), nullable=False)
    friend_id = db.Column(db.Integer, db.ForeignKey('User.user_id'), nullable=False)
    relationship_stat = db.Column(db.Integer)
    user_ref = relationship('User', backref= 'friends_usr', foreign_keys='Friends.friend_id')
    friend_ref = relationship('User', backref= 'friends_frnd', foreign_keys='Friends.user_id')

    def __init__(self, user_id, friend_id, relationship_stat):
        self.user_id = user_id
        self.friend_id = friend_id
        self.relationship_stat = relationship_stat

    def __repr__(self):
        return '<friend_id {}>'.format(self.friend_id)
    
class Games(db.Model):
    __tablename__ = 'Games'
    game_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    game_name = db.Column(db.String(50), unique=True)
    img_path = db.Column(db.String(120))
    user_games = db.relationship('User_games', backref='games', cascade='all, delete, delete-orphan') 

    def __init__(self, game_name, img_path):
        self.game_name = game_name
        self.img_path = img_path

    def __repr__(self):
        return '<game_name {}>'.format(self.game_name)
    
class User_games(db.Model):
    __tablename__ = 'User_games'
    user_id = db.Column(db.Integer, db.ForeignKey('User.user_id'), primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey('Games.game_id'), primary_key=True)
    fav_game = db.Column(db.Boolean, default=False)

    def __init__(self, user_id, game_id):
        self.user_id = user_id
        self.game_id = game_id

    def __repr__(self):
        return '<user_id {}>'.format(self.user_id)

class Lobby(db.Model):
    __tablename__ = 'Lobby'
    lobby_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    game_id = db.Column(db.Integer, db.ForeignKey('Games.game_id'))
    host_id = db.Column(db.Integer, db.ForeignKey('User.user_id'))
    num_players = db.Column(db.Integer)
    title = db.Column(db.String(50))
    description = db.Column(db.String(10000))
    date = db.Column(db.DateTime(timezone=True), default=func.now())
    priv = db.Column(db.Boolean, default=False)

    players = relationship('Lobby_Players', backref='lobby_player', lazy='dynamic')

    def __init__(self, game_id, host_id, num_players, title, description, priv=False):
        self.game_id = game_id
        self.host_id = host_id
        self.num_players = num_players
        self.title = title
        self.description = description
        self.priv = priv

    def __repr__(self):
        return '<host_id {}>'.format(self.host_id)

class Lobby_Players(db.Model):
    __tablename__ = 'Lobby_Players'
    LPlayers_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    lobby_id = db.Column(db.Integer, db.ForeignKey('Lobby.lobby_id'))
    players_id = db.Column(db.Integer, db.ForeignKey('User.user_id'), nullable=True)

    def __init__(self, lobby_id, players_id=None):
        self.lobby_id = lobby_id 
        self.players_id = players_id

    def __repr__(self):
        return '<lobby_id {}>'.format(self.lobby_id)

class Chat(db.Model):
    __tablename__ = 'Chat'
    chat_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    lobby_id = db.Column(db.Integer, db.ForeignKey('Lobby.lobby_id'))
    user_id = db.Column(db.Integer, db.ForeignKey('User.user_id'))
    messages = db.Column(db.String(10000))
    time_stamp = db.Column(db.TIMESTAMP, default=func.now())

    def __init__(self, lobby_id, user_id, messages, time_stamp):
        self.lobby_id = lobby_id 
        self.user_id = user_id
        self.messages = messages
        self.time_stamp = time_stamp

    def __repr__(self):
        return '<lobby_id {}>'.format(self.lobby_id)


