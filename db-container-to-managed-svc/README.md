<p>
I have setup docker on my computer, and started 3 containers running the 3 databases. 
</p>
<p align="center">
  <img src="images/Docker_Running_DB_Containers.PNG" title="Docker Containers">
</p>
<p>
I have installed HammerDB on my computer, and loaded the TPCC schema on all the 3 database containers. After the schema loads, we can simulate multiple users running on the databases. I am running 10 users, against the same dataset, on the same computer to provide an unbiased comparison. 
Here is the MSSQL result:
</p>
<p align="center">
  <img src="images/MSSQL_Docker_TPM.PNG" title="Docker Containers">
</p>
Here is the MYSQL result:
<p align="center">
  <img src="images/MYSQL_Docker_TPM.PNG" title="Docker Containers">
</p>
Here is the Postgres result:
<p align="center">
  <img src="images/Postgres_Docker_TPM.PNG" title="Docker Containers">
</p>
<p>
Let is create the databases on Azure. Create the MSSQL database using the ARM template, by executing 1002-Create-MYSQLDB.ps1. After provisioning, make sure to go to connection settings, and allow connection from the local latpop by adding the IP address. I have tried to hit this small server from local and from a VM inside a VNET and the performance numbers were very similar. Here is the chart of how it performs with 50 users, 500 ms delay between queries.
</p> 
<p align="center">
  <img src="images/MYSQL_Azure_DB_From_Local.PNG" title="Docker Containers">
</p>
<p>
Now the same tests with a Postgres database.
</p>
<p align="center">
  <img src="images/Postgres_Azure_DB_From_AzureVM.PNG" title="Docker Containers">
</p>
<p align="center">
  <img src="images/Postgres_Monitor_Graph_2vcpu.PNG" title="Docker Containers">
</p>
<p>
Now we scale up the number of CPUs from 2 vcore to 32 vcore.
MYSQL
</p>
<p align="center">
  <img src="images/MYSQL_Azure_DB_From_Local_32vcpu.PNG" title="Docker Containers">
</p>
<p align="center">
  <img src="images/MYSQL_Monitor_Graph_32vcpu.PNG" title="Docker Containers">
</p>
<p>
Postgres. Note how the CPU stays pretty put close to 100% for the entire 1/2 hr of the test. 
Getting around 24K transactions per minute. 
</p>
<p align="center">
  <img src="images/Postgres_Azure_DB_From_Local_32vcore.PNG" title="Docker Containers">
</p>
<p align="center">
  <img src="images/Postgres_Monitor_Graph_32vcpu.PNG" title="Docker Containers">
</p>
<p>
Kubernetes (AKS) deployment
</p>  
<p align="center">
  <img src="images/AKS_cluster_postgres_deployment.png" title="Docker Containers">
</p>
<p align="center">
  <img src="images/AKS_cluster_postgres_pv.png" title="Docker Containers">
</p>
<p align="center">
  <img src="images/AKS_cluster_postgres_Loadtest.PNG" title="Docker Containers">
</p>
<p>
<p>
#Increasing the user load to 100 users.
</p>
</p>
<p align="center">
  <img src="images/AKS_cluster_postgres_Loadtest_100user.PNG" title="Docker Containers">
</p>
<p align="center">
  <img src="images/AKS_cluster_postgres_Stats1.PNG" title="Docker Containers">
</p>

