sudo apt update
sudo apt install -y openjdk-17-jdk
sudo apt install -y python
sudo apt install -y sshpass

sshpass -p 'Ganesh20022002' scp -o StrictHostKeyChecking=no  venkyuser@10.0.0.4:/var/lib/rancher/k3s/server/node-token .
export MASTER_TOKEN=$( cat node-token )
echo $MASTER_TOKEN
curl -sfL https://get.k3s.io | K3S_URL=https://10.0.0.4:6443 K3S_TOKEN=$MASTER_TOKEN sh -