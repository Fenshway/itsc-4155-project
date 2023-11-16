from models.model import User, db # This are always necessary when calling the database
from backend.app import app
from sqlalchemy import inspect, text, exc # This one too to check for douplicates and handle them
import datetime


'''# Drops all Tables along it's data(Run this if there's been a change to the tables create statement(models.py) ONLY)
with app.app_context():
    db.session.execute(text('DROP TABLE if exists public.\"User\" cascade'))
    db.session.execute(text('DROP TABLE if exists public.\"UserImage\" cascade'))
    db.session.execute(text('DROP TABLE if exists public.\"Friends\" cascade'))
    db.session.execute(text('DROP TABLE if exists public.\"Blocked\" cascade'))
    db.session.execute(text('DROP TABLE if exists public.\"Games\" cascade'))
    db.session.execute(text('DROP TABLE if exists public.\"User_games\" cascade'))
    db.session.execute(text('DROP TABLE if exists public.\"Lobby\" cascade'))
    db.session.execute(text('DROP TABLE if exists public.\"Lobby_Players\" cascade'))
    db.session.execute(text('DROP TABLE if exists public.\"Chat\" cascade'))
    db.session.commit()
    db.drop_all()'''

# Creates the tables
with app.app_context():
    db.create_all()

# This is the way to call the email from all users in the User table
with app.app_context(): # The app.app_context() is only necessary when calling the database from outside the Flask scope(aka routes)
    userInfo = User.query.all()
    for user in userInfo:
        print(user.email)

print('--------------------------------------------------------------')

# This is the way to add a new user to the User table. (Keep in mind fav_game_id is optional here that's why it isn't shown)
new_user = User(email='admin@quest.com', user_password='password', user_name='Admin')
test_user = User(email='test@quest.com', user_password='password', user_name='Test')
with app.app_context():
    try:
        db.session.add(new_user)
        db.session.commit()
    except exc.IntegrityError: # In case it already exists
        db.session.rollback() # Basically undo any changes in memory
    try:
        db.session.add(test_user)
        db.session.commit()
    except exc.IntegrityError:
        db.session.rollback()
#   Cont. to show result
    userInfo = User.query.all()
    for user in userInfo:
        print(user.email)
print('------------------------POST-DELETE------------------------')

# This is how to delete a User based only on their user_id(primary key)
with app.app_context():
    User.query.filter_by(user_name='Test').delete()
    db.session.commit()
# Cont. to show result
    userInfo = User.query.all()
    for user in userInfo:
        print(user.email)

print('------------------------POST-UPDATE------------------------')

# This is how to update a already created User's email
with app.app_context():
    admin = User.query.filter_by(user_name='Admin').first()
    admin.email = 'admin@meta.com'
    db.session.commit()
# Cont. to show result
    userInfo = User.query.all()
    for user in userInfo:
        print(user.email)

# Back to normal
with app.app_context():
    admin = User.query.filter_by(user_name='Admin').first()
    admin.email = 'admin@quest.com'
    db.session.commit()

#------------------------Game-add-test------------------------
# This is how to add games to the Games table
from models.model import Games
from models.model import User_games

with app.app_context():
    try:
        new_game = Games(game_name='Left 4 Dead 2', img_path='left4dead2-games.jpg') # Image does not exists this is just for show
        db.session.add(new_game)
        db.session.commit()
    except exc.IntegrityError:
        db.session.rollback()

    # Now we make Admin an owner of Left 4 Dead 2
    admin = User.query.filter_by(user_name='Admin').first()
    l4d2_game = Games.query.filter_by(game_name='Left 4 Dead 2').first()

    try:
        admin_game = User_games(user_id=admin.user_id, game_id=l4d2_game.game_id)
        db.session.add(admin_game)
        db.session.commit()
    except exc.IntegrityError:
        db.session.rollback()

    # After the game has been created and added to the table, we can now set it as favorite if we want
    admin_fav = User_games.query.filter_by(user_id=admin.user_id).first()
    admin_fav.fav_game = True
    db.session.commit()

#------------------------Rating-add-test------------------------
'''
print('------------------------RATING_TEST------------------------')
from models.model import UserRating
with app.app_context():
    try:
        new_rating = UserRating(9, 10, -1) # User ID#9(username) is rating User ID#10(mherna61) with a downvote(-1)
        db.session.add(new_rating)
        db.session.commit()
    except exc.IntegrityError:
        db.session.rollback()

    rated_user = User.query.filter_by(user_id=10).first()
    rating_process = UserRating.query.filter_by(judge_id=9).first()

    print(rated_user.user_name + ' rating is: ' + str(rated_user.user_rating))
    print(str(rating_process.judge_id) + ' downvoted: ' + str(rating_process.user_id) + ' by ' + str(rating_process.rateChange) + ' points.')
'''

print('------------------------STATUS_TEST------------------------')
with app.app_context():
    admin = User.query.filter_by(user_name='Admin').first()
    admin.user_status = 1 # Update status
    db.session.commit()

    admin = User.query.filter_by(user_name='Admin').first()
    if admin.user_status == 0:
        print('Admin is offline')
    elif admin.user_status == 1:
        print('Admin is online')
    elif admin.user_status == 2:
        print('Admin is in DND mode')
    elif admin.user_status == 3:
        print('Admin is idle')
    elif admin.user_status == 4:
        print('Admin is ivisible')

# How to create a Database on pgAdmin(postgresSQL)
#   Right-click on Servers and select Register > Server
#   Input a name for the Server
#   In the second tab; For the Host name/address, write 'localhost'
#   For Username you can choose another username or leave it as it is
#   Keep in mind the host-address, port, and username; This is the info you put on the .env file
#   Click save
#   Expand the newly created Server and right-click Databases then Create > Database
#   Choose a name for the Database(this is the DB-NAME for the .envfile), then click save
#   That's it, now input the info you got into a new .env file following the .env.sample template

# Run this file to confirm it works, there should be no errors.

print('------------------------Test on user\'s date creation------------------------')
with app.app_context():
    admin = User.query.filter_by(user_name='Admin').first()
    print('Admin was created on: ' + str(admin.date_created))
    print('Current date: ' + str(datetime.utcnow()))

    isValid = admin.can_rate()
    if isValid:
        print('Admin can do that.')
    else:
        print('Admin can NOT do that!')


'''
# Extra and shouldn't be used unless it's for intended debugging purpose
# Deletes ALL data from all tables
#with app.app_context():
#    print(db.metadata.tables.keys())
#    for tbl in reversed(db.metadata.sorted_tables):
#        db.session.execute(tbl.drop(db.session))

# Drops all Tables along it's data(Run this if there's been a change to the tables create statement)
#with app.app_context():
#    db.drop_all()
'''