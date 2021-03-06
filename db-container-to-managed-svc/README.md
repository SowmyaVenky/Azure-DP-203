<p>
This experiment is to determine whether databases are a good fit to run inside a Kubernetes cluster. We will try different database engines, deployed in multiple ways:

<ul>
<li>Deploy MSSQL, MYSQL, and Postgres in docker running locally.</li>
<li>Deploy MySQL inside Azure with Basic configuration (2 vCPUs).</li>
<li>Deploy MySQL inside Azure with General Purpose configuration (32 vCPUs).</li>
<li>Deploy Postgres inside Azure with Basic configuration (2 vCPUs).</li>
<li>Deploy Postgres inside Azure with General Purpose configuration (32 vCPUs).</li>
<li>Deploy Postgres inside an AKS cluster with a SSD persistent volume.</li>
</ul>

For each of these cases, we will fire HammerDB and test the TPCC workload with 10 users, and expand it to 100 users. 

<b>Summary</b>
<table border="1" width="100%">
<tr>
<td>Option</td>
<td>Finding</td>
</tr>
<tr>
<td>Docker Containers</td>
<td>The databases performed amazing. Postgres was the fastest among the three engines, with MSSQL being second, and MYSQL being the worst among the three. The memory used and CPU were also not high. Even with 10 users, the tps were pretty high as shown below. Since there was no network or I/O latency, the database engines, by themselves are pretty good when handling this workload.</td>
</tr>
<tr>
<td>Azure database (PaaS)</td>
<td>The PaaS offerings did not perform as great as the docker local versions. With MYSQL, the performance was pretty bad, and the bottleneck seemed to be at the I/O level. The remote storage probably hurt performance. The CPU and memory usages were pretty low. With the Postgres PaaS, the number of transactions were higher, and the CPU seemed to be the bottleneck.</td>
</tr>
<tr>
<td>Postgres on AKS</td>
<td>The AKS option performed consistently lower when compared to the PaaS offerings. Scaling up and down is very easy in PaaS and causes minimum downtime, but with the AKS option, we have to resort to Kubernetes native constructs to get the scaling to occur. I was not able to get the scaling to 32 vCPUs for the POD to do a comparable test. The managed disk (persistent volume claim) had no easy way to backup/restore, and we would be foregoing options like read replicas, geo-failover etc. that are native to the PaaS offering.</td>
</tr>
<tr>
<td>Thoughts</td>
<td>The PaaS offerings are very easy to deploy, and offer way more configuration options. The actual database patching and maintenance are offloaded to Azure. The scaling up/down is automatic, and we can do read-replicas, and geo-replication. Point in time restores and integration to business continuity features like Azure Recovery vaults are available out of the box. AKS deployment is definitely a viable option for smaller use-cases where we do not care about read-scaling, and automatic backup and point in time restore. This option is pretty much IaaS with containers. Patching and upgrades are all on us, and new containers need to be built to address these things.</td>
</tr>
</table>
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
Increasing the user load to 100 users.
</p>
</p>
<p align="center">
  <img src="images/AKS_cluster_postgres_Loadtest_100user.PNG" title="Docker Containers">
</p>
<p align="center">
  <img src="images/AKS_cluster_postgres_Stats1.png" title="Docker Containers">
</p>

