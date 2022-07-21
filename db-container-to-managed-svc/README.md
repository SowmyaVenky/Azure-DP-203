I have setup docker on my computer, and started 3 containers running the 3 databases. 
<p align="center">
  <img src="Docker_Running_DB_Containers.PNG" title="Docker Containers">
</p>
I have installed HammerDB on my computer, and loaded the TPCC schema on all the 3 database containers. After the schema loads, we can simulate multiple users running on the databases. I am running 10 users, against the same dataset, on the same computer to provide an unbiased comparison. 
Here is the MSSQL result:
<p align="center">
  <img src="MSSQL_Docker_TPM.PNG" title="Docker Containers">
</p>
Here is the MYSQL result:
<p align="center">
  <img src="MYSQL_Docker_TPM.PNG" title="Docker Containers">
</p>
Here is the Postgres result:
<p align="center">
  <img src="Postgres_Docker_TPM.PNG" title="Docker Containers">
</p>
