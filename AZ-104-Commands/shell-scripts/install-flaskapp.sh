sudo apt update
sudo apt install -y python3 python3-dev python3-pip git python3-flask
git clone https://github.com/Azure-Samples/azure-stack-hub-flask-hello-world.git
cd azure-stack-hub-flask-hello-world
pip3 install -r requirements.txt
wget https://raw.githubusercontent.com/SowmyaVenky/Azure-DP-203/main/AZ-104-Commands/flask-app/echohost.py
export FLASK_APP=echohost.py
nohup flask run -h 0.0.0.0 &
