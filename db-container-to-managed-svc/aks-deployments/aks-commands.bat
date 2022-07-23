kubectl create ns postgresdb
kubectl config set-context --current --namespace=postgresdb
kubectl apply -f .\aks-deployments\postgres-secret.yaml -n postgresdb 
kubectl get secrets -n postgresdb
kubectl apply -f .\aks-deployments\postgres-pv.yaml -n postgresdb
kubectl get pvc -n postgresdb 
@REM Wait for the disk to provision.
kubectl apply -f .\aks-deployments\postgres-deployment.yaml -n postgresdb
kubectl get deploy
kubectl get po 
kubectl logs postgres-69b65b9fd9-lxc5k
@rem make sure that you see the database is running, and it ready to accept connections.
kubectl apply -f .\aks-deployments\postgres-service.yaml -n postgresdb
kubectl get svc 
@rem wait for the service to provision and note the external ip