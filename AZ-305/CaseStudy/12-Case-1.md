**Overview**

Contoso, Ltd, is a US-based financial services company that has a main office in New York and a branch office in San Francisco.

  **Existing Environment**

 **_Payment Processing System_**

 *  Contoso hosts a **business-critical payment processing system** in its **New York data center**. The system has three tiers: a front-end web app, a middle-tier web API, and a back-end data store implemented as a Microsoft SQL Server 2014 database. All servers run Windows Server 2012 R2.
	 * ***Observations***
		 * This looks like a typical on-premise deployed system. The system is deployed in one data center so BCDR is going to be an issue. The system is designed with a tiered approach. The database is SQL Server. The middle tier is exposed as APIs.

 * The front-end and middle-tier components are hosted by using Microsoft Internet Information Services (IIS). The application code is written in C# and ASP.NET.

	 * ***Observations***
		 * It looks like the technology used to develop the front end and middle tier are compatible with PaaS offerings like Azure App Service. If a lift and shift approach is preferred, it is easy to host these on IaaS VMs that have IIS installed.

 * The middle-tier API uses the Entity Framework to communicate to the SQL Server database. Maintenance of the database is performed by using SQL Server Agent jobs.

 * The database is currently 2 TB and is not expected to grow beyond 3 TB.

	 * ***Observations***
		 * It looks like there are some custom agent jobs running on the database layer that might limit our options on Azure. The database size is less than 4TB, so Azure SQL could have been an option. Managed instance might be required because of the agent jobs requirement.

 *  _The payment processing system has the following compliance-related requirements:_

 * Encrypt data in transit and at rest. Only the front-end and middle-tier components must be able to access the encryption keys that protect the data store.

	 * ***Observations***
		 * It looks like there are requirements to encrypt the database columns using custom encryption keys based on the front-end / middle-tier requiring access to the keys to decrypt the data. This is pushing is towards the "Always Encrypted" model of encrypting columns using keys in an Azure Key Vault.

 * Keep backups of the data in two separate physical locations that are at least 200 miles apart and can be restored for up to seven years.

 * Support blocking inbound and outbound traffic based on the source IP address, the destination IP address, and the port number.
 
	 * ***Observations***
		 * It looks like there are requirements to setup long term retention on the database. The backup should be stored with the GRS disposition. That way the backup requirements are met. 
		 * The database server needs to be configured with a firewall to allow the connections from only the front-end / middle-tier. We could host everything in the same VNET, but if they are on separate networks the firewall rules can be configured to allow traffic.
		  
 * Collect Windows security logs from all the middle-tier servers and retain the logs for a period of seven years.

	 * ***Observations***
		 * Azure log analytics agent (deprecated) can be installed in the windows virtual machines to push the security events to the centralized log analytics workspace. KQL queries can be run on the collected data to trigger alerts based on query responses. The log analytics agent is getting replaced with the Azure Monitor agent. 

 * Inspect inbound and outbound traffic from the front-end tier by using highly available network appliances.

	 * ***Observations***
		 * Azure network insights can probably fit most of these requirements. If there is custom software installed, then these could be implemented in virtual machines, and routing tables adjusted from the subnets to allow next hop via the network appliances. 
		  
 * Only allow all access to all the tiers from the internal network of Contoso.

	 * ***Observations***
		 * Azure internal load balancer can do the trick for this requirement.
		  
 * Tape backups are configured by using an on-premises deployment of Microsoft System Center Data Protection Manager (DPM), and then shipped offsite for long term storage.

**_Historical Transaction Query System_**

Contoso recently migrated a business-critical workload to Azure. The workload contains a .NET web service for querying the historical transaction data residing in **Azure Table Storage.** The .NET web service is accessible from a client app that was developed in-house and runs on the **client computers in the New York office**.

The data in the table storage is 50 GB and is not expected to increase.

  

**_Current Issues_**

The Contoso IT team discovers poor performance of the historical transaction query system, as the queries frequently cause table scans.

  

**Requirements**

**_Planned Changes_**

* Contoso plans to implement the following changes:

* Migrate the payment processing system to Azure.

* Migrate the historical transaction data to Azure Cosmos DB to address the performance issues.

  

**_Migration Requirements_**

*  _Contoso identifies the following general migration requirements:_

* Infrastructure services must remain available if a region or a data center fails. Failover must occur without any administrative intervention.

* Whenever possible, Azure managed services must be used to minimize management overhead.

* Whenever possible, costs must be minimized.

*  _Contoso identifies the following requirements for the payment processing system:_

* If a **data center fails,** ensure that the payment processing system remains available without any administrative intervention. The middle-tier and the web front end must continue to operate without any additional configurations.
		  
* Ensure that the number of compute nodes of the front-end and the middle tiers of the payment processing system can increase or decrease automatically based on CPU utilization.

* Ensure that each tier of the payment processing system is subject to a Service Level Agreement (SLA) of 99.99 percent availabilty.

	 * ***Observations***
		 * Multi-AZ deployment using one or more Virtual Machine Scale Set. CPU usage can be used to scale in / out on both the tiers as load changes. If we deploy it across 3 AZs, the SLA can be achieved. Since the database also needs to have this SLA, business critical tier might become a requirement.

* Minimize the effort required to modify the middle-tier API and the back-end tier of the payment processing system.
	* Hinting towards VM deployments, not App Service.

* Payment processing system must be able to use grouping and joining tables on encrypted columns.
	* Encryption with deterministic column encryption, since joining is required.

* Generate alerts when unauthorized login attempts occur on the middle-tier virtual machines.
	* Security events are getting pushed into the log analytics workspace. The failed logins will generate events and get pushed to the workspace. KQL can be used to query for these, and alerts generated based on existence of these events.

* Ensure that the payment processing system preserves its current compliance status.
	* Compliance can be evaluated, and corresponding policies written to make sure the compliance can be achieved in Azure. Overall compliance score can be seen on the Security Center.

* Host the middle tier of the payment processing system on a virtual machine

*  _Contoso identifies the following requirements for the historical transaction query system:_

* Minimize the use of on-premises infrastructure services.

* Minimize the effort required to modify the .NET web service querying Azure Cosmos DB.
	* Table API compatibility is maintained.

* Minimize the frequency of table scans.

* If a region fails, ensure that the historical transaction query system remains available without any administrative intervention.
	* Multi-region read  replicas can be provisioned.

  

**_Information Security Requirements_**

* The IT security team wants to ensure that identity management is performed by using Active Directory. Password hashes must be stored on-premises only.
	* Since auth has to happen on-premise we might need to setup a pass-through authentication scheme. 

* Access to all business-critical systems must rely on Active Directory credentials. Any suspicious authentication attempts must trigger a multi-factor authentication prompt automatically.
	* This is a classic case of setting up conditional access policies. We can setup policies to allow access based on device status, and MFA mandated as needed. MFA registration can also be mandated via conditional access policy.