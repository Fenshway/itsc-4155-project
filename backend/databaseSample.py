from models.model import User, db, app # This are always necessary when calling the database
from sqlalchemy import exc # This one too to check for douplicates and handle them

# This is the way to call the email from all users in the User table
with app.app_context(): # The app.app_context() is only necessary when calling the database from outside the Flask scope(aka routes)
    userInfo = User.query.all()
    for user in userInfo:
        print(user.email)

print('--------------------------------------------------------------')

# This is the way to add a new user to the User table. (Keep in mind fav_game_id is optional here that's why it isn't shown)
new_user = User(user_id=0, email='admin@quest.com', user_password='password', user_name='Admin')
test_user = User(user_id=1, email='test@quest.com', user_password='password', user_name='Test', fav_game_id=69)
with app.app_context():
    try:
        db.session.add(new_user)
        db.session.commit()
        #db.session.add(test_user)
        #db.session.commit()
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
    User.query.filter_by(user_id=1).delete()
    db.session.commit()
# Cont. to show result
    userInfo = User.query.all()
    for user in userInfo:
        print(user.email)

print('------------------------POST-UPDATE------------------------')

with app.app_context():
    admin = User.query.filter_by(user_id=0).first()
    admin.email = 'admin@meta.com'
    db.session.commit()
# Cont. to show result
    userInfo = User.query.all()
    for user in userInfo:
        print(user.email)

# Back to normal
with app.app_context():
    admin = User.query.filter_by(user_id=0).first()
    admin.email = 'admin@quest.com'
    db.session.commit()

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