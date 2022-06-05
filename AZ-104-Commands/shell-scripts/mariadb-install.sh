sudo apt update
export DEBIAN_FRONTEND=noninteractive
sudo debconf-set-selections <<< "mariadb-server mysql-server/root_password password petclinic"
sudo debconf-set-selections <<< "mariadb-server mysql-server/root_password_again password petclinic"
sudo apt-get install -y mariadb-server