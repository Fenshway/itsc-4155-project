LFG gaming application facilitating seamless player collaboration with features such as friends lists, creating/joining/leaving/deleting lobbies, and real-time chat. 

Technology Used:
  Flask
  Angular
  PostgreSQL

Instructions to run:

cd backend
python -m venv venv
source venv/Scripts/activate (windows with bash terminal)
pip install -r requirements.txt
touch .env
configure .env file (based on .env.sample)
flask --debug run

<<<split terminal>>>

cd frontend
npm install (must have node.js installed)
ng serve (if ng serve does not work, run this command : npm install -g @angular/cli   ) then rerun ng serve

localhost:4200

Instructions to implement the database:

Open CMD and change dicrectory to where PostgreSQL was installed (cd "C:\Program Files\PostgreSQL\[VER-NUM]\bin").

Then use the following command:
psql -U [USER-NAME] -d [DATABASE-NAME] -f [PATH TO QuestDB.sql(...itsc-4155-project\backend\QuestDB.sql)]

It will ask for the server's password, make sure to have it.

Finally, add the following line to the .env file(in the backend folder):
DATABASE_URI='postgresql://[USER-NAME]:[PASSWORD]@[HOSTNAME/ADDRESS]:[PORT]/[DATABASE-NAME]'

Database has been implemented.

You can find the USER-NAME, HOSTNAME/ADDRESS and PORT by opening PostgreSQL and right clicking the server you want to restore the Database into, then selecting properties and going to the connection tab (if local, the hostname should be 'localhost'). DATABASE-NAME is the name of the database under the same chosen server and must be an empty new database. Password for the server is hidden and the user should know it.