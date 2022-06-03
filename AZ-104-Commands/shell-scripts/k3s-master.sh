sudo apt update
sudo apt install -y openjdk-17-jdk
sudo apt install -y python

# This will install the master k3s node. Get the token and we need to use this on the slaves.
curl -sfL https://get.k3s.io | sh -
sudo cat /var/lib/rancher/k3s/server/node-token
wget -q -O - https://downloads.yugabyte.com/get_clients.sh | sh
sudo chmod -R 777 /var/lib/rancher/k3s/server/