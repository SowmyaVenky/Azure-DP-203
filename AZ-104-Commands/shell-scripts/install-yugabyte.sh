sudo apt update
sudo apt install -y openjdk-17-jdk
sudo apt install -y python
wget https://downloads.yugabyte.com/releases/2.13.2.0/yugabyte-2.13.2.0-b135-linux-x86_64.tar.gz
tar xvfz yugabyte-2.13.2.0-b135-linux-x86_64.tar.gz && cd yugabyte-2.13.2.0/
./bin/post_install.sh
./bin/yugabyted start
./bin/yugabyted status
