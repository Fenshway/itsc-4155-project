venv/Scripts/activate
pip install -r requirements.txt
cd backend
flask --debug run
<<<split terminal>>>
cd ..
cd frontend
npm install
ng serve