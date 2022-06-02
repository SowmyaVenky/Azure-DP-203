1. Login to the venky-win-entry windows machine using RDP. This is exposed to public via public IP.
2. k3s master node is 10.0.0.4 - ssh into that 
ssh venkyuser@10.0.0.4
sudo apt update
# This will install the master k3s node. Get the token and we need to use this on the slaves.
curl -sfL https://get.k3s.io | sh -
sudo cat /var/lib/rancher/k3s/server/node-token

# Get this token value from the prev command, and execute these 2 commands after replacing the token
# string. Do this on both the slave nodes.
export MASTER_TOKEN=K10cc27ee85fb820867c6b80647b296b791d71595716c28c0e2da2550e42f0ccc1a::server:3f3400fce3ee72dbcbebf58780d3ba1c
curl -sfL https://get.k3s.io | K3S_URL=https://10.0.0.4:6443 K3S_TOKEN=$MASTER_TOKEN sh -

## Execute this on the master node to see and make sure the 2 other nodes are registered.
venkyuser@venky-k3s-master-node:~$ sudo k3s kubectl get no
NAME                    STATUS   ROLES                  AGE     VERSION
venky-k3s-slave-1       Ready    <none>                 2m21s   v1.23.6+k3s1
venky-k3s-master-node   Ready    control-plane,master   7m32s   v1.23.6+k3s1
venky-k3s-slave-2       Ready    <none>                 20s     v1.23.6+k3s1

# next let us try a quick deployment to make sure it works
sudo k3s kubectl create deployment kubernetes-bootcamp --image=gcr.io/google-samples/kubernetes-bootcamp:v1
sudo k3s kubectl expose deployment kubernetes-bootcamp --type=LoadBalancer --name=my-service --port=8080 --target-port=8080

# open browser to check http://10.0.0.4:8080/ -- and we should see a page.

# Scale
sudo k3s kubectl scale deployment kubernetes-bootcamp --replicas=3

# Check to make sure pods have scaled
sudo k3s kubectl get po -o wide
