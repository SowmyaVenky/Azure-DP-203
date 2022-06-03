sudo apt update
sudo apt install -y python 
sudo wget https://downloads.yugabyte.com/releases/2.13.2.0/yugabyte-2.13.2.0-b135-linux-x86_64.tar.gz
sudo tar xvfz yugabyte-2.13.2.0-b135-linux-x86_64.tar.gz && cd yugabyte-2.13.2.0/
sudo ./bin/post_install.sh
sudo ./bin/yugabyted start
sudo ./bin/yugabyted status
