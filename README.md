# Azure-DP-203

YouTube Follow Alongs:
https://www.youtube.com/channel/UCI5gdy3DaIITi_jTYXhLmVA

This project shows some of the experiments we can do to get familiar with the aspects tested on the DP-203 exam. Here are the steps to get the basic stuff provisioned via ARM templates. We can do this a couple of times via the UI to get familiar, but we can save a lot of time by making it create via the ARM templates. 

<p align="center">
  <img src="SampleArchitecture.png" title="Sample Architecure">
</p>

Here are the steps:

1. Create a SQL server database. 
2. Login to the SQL Server database after adjusting the firewall to allow us to connect from our personal IP using SSMS
3. Create the tables and data that is required by using the scripts under sqlserver folder.
4. Create a data factory instance for us
5. Create a storage account with a containers in it.    
6. Write a data factory job to extract the data from the sql server database and put it on the blob storage container.


For AZ-104 please see the AZ-104 commands folder 
# Azure-AZ-104

This project shows some of the experiments we can do to get familiar with the aspects tested on the AZ-104 exam. Lot of fun things to create here and get our hands dirty! 

<p align="center">
  <img src="AZ-104-Notes/images/AZ-104-SampleArchitecture.png" title="Sample Architecure">
</p>

Here are the steps:

0. Create the storage account using the 1000-Create-Storage.ps1.
0.1 - Upload the install-yugabyte.sh to the venkyinitscr101/initsh101 container. This is referenced by the startup script that is used with the yugabyte VM. So, please make sure this is in place. Can automate further to make it azcopy into the right location.
1. Run the 1001-Create-K3s-Cluster.ps1. This will create 4 VMs. One windows machine with a public IP that acts as a gateway. The other 3 ubuntu machines will become part of a k3s cluster. We have to do a manual install of k3s following the steps in the install-k3s-master.sh. 
2. We will create another ubuntu VM, and install Yugabyte 3 node cluster using the init scripts. We will need to upload the scripts needed to the storage account, and reference it via the arm script. Better to do this manually once rather than using ARM template to get practice.
3. We will peer the vnet 1 to vnet 2 and check the peering status on the Peering left menu option on each of the subnets. it should show connected on both of them.
4. Once the peering is good to go, we should be able to go to this URL from the win-entry VM to make sure that the yugabyte is installed via the custom scripts the way we want.
5. In the win-entry vm, here is the path 
    /var/lib/waagent/custom-script/download/0/yugabyte-2.13.2.0/bin#
5.1 Check the yugabyte installed here.
  /var/lib/waagent/custom-script/download/1/yugabyte-2.13.2.0/    
5.2. Do a ps -ef | grep yuga to make sure the processes are running fine.
6. We will use ACI to push container with H2 for initial test. 1007 Script
7. We will use ACI to push the yugabyte spring app to test 1008 script.
    http://venkyybtest.<region>.azurecontainer.io:8080/loaddb?amount=100 - Create 100 recs in yugabyte database.
    http://venkyybtest.<region>.azurecontainer.io:8080/showdb?page=0 - Show the data in the database. This demonstrates spring boot yugabyte
8. Create a load balancer and put 2 ubuntu VMs behind it. The loadbalancer will allow for / on its public IP and redirect to one of the 2 VMs in the pool. A flask app runs on both VMs listening on 5000 and server a simple message. The load balancer is also setup with NAT rules, that allow us to SSH into the VMs via the load balancer, not exposing any public IPs. 
9. Create an application gateway to demonstrate the user of layer-7 load balancing rather than lever-4 done by the network load balancer. We can redirect to different vms  based on a path pattern, or setup a multi-site infra to allow for us to do microsites.
10. We will deploy a spring boot app on the k3s cluster that will talk to this Yugabyte DB, and test it out.
11. Test out AKS
12. Test out ACI
13. Establish P2S vpn between laptop and VNET.
14. Deploy flask app to demonstrate route based load balancing across multiple VMs using app gateway.
15. Private DNS zones and VNET linking.

*** To Learn About #Azure DP-203 Data Engineering Concepts and Certification
1. https://learn.microsoft.com/en-us/training/courses/dp-203t00
2. https://medium.com/@ershivamgupta/how-to-pass-microsofts-azure-data-engineer-certification-dp-203-exam-guide-5b4f0c35252f
3. https://kloudsaga.com/important-data-engineering-concepts-microsoft-azure/
4. https://courses.kloudsaga.com/courses/microsoft-azure-data-engineer-exam-practice-sets
