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
