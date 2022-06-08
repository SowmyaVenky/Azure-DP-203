sudo apt update
sudo apt install -y python3 python3-dev python3-pip git python3-flask
git clone https://github.com/Azure-Samples/azure-stack-hub-flask-hello-world.git
cd azure-stack-hub-flask-hello-world
pip3 install -r requirements.txt

export FLASK_APP=application.py
nohup flask run -h 0.0.0.0 &
