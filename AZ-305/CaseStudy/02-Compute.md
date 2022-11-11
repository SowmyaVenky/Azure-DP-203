---
casestudy:
    title: 'Design a compute solution'
    module: 'Compute solutions'
---

# Design a compute solution

## Requirements

Tailwind Traders would like to migrate their product catalog application to the cloud. This application has a traditional 3-tier configuration using SQL Server as the data store. The IT team hopes you can help modernize the application. They have provided this diagram and several areas that could be improved. 

![compute architecture](media/compute.png)

* The frontend application is a .NET core-based web app. During peak periods 1750 customers visit the website each hour. 

* The application runs on IIS web servers in a front-end tier. This tier handles all customer requests for purchasing products. During the latest holiday sale, the front-end servers reached their performance limits and page loads were lengthy. The IT team has considered adding more servers, but during off hours the servers are often idle.

* The middle tier hosts the business logic that processes customer requests. These requests are often for help desk support. Support requests are queued and lately the wait times have been very long. Customers are offered email rather than wait for a representative. But many customers seem frustrated and are disconnecting rather than wait. Customer requests are 75-125 per hour. 

* The back-end tier uses SQL Server database to store customer orders. Currently, the back-end database servers are performing well.

* While high availability is a concern, due to legal requirements the company must keep all the resources in a single region.

## Tasks

* **Front-end tier**. Which Azure compute service would you recommend for the front-end tier? Explain why you decided on your solution. 

* **Middle tier**. Which Azure compute service would you recommend for the middle tier? Explain why you decided on your solution. 

How are you incorporating the Well Architected Framework pillars to produce a high quality, stable, and efficient cloud architecture?


## ** Possible Solution **
* The entire solution has to remain in a single region. This means that we do not need all the sophisticated multi-region load balancing options like Azure Front Door and Azure Traffic Manager.

* It does not seem like there is a global consumer foot-print that would require us to incorporate cache solutions like Redis, or a CDN. These options can be evaluated as the company grows in the future. 

* Since the application is written in .NET core, it can run both on windows and linux. It can also be packaged into a container and that opens up even more options for us. 

* Option 1 - We can take the code that is written for the web app and move it into an Azure Application Service. The code can be checked into a git repository, and the application service can be configured with git integration to enable CI/CD whenever code is committed to the git repo. The application service plan can be setup to ensure that custom DNS, and scaling options are enabled. The provisioning of deployment slots enables us to deploy the app to a staging slot, and swap it to production after doing initial validations. None of the infrastructure needs to be maintained and it gives us great flexibility. If containerization is mandatory for some reason, we can use Azure App service with containers.

* Option 2 - Once the application is packaged into a container, we can use Azure container instances to deploy it as a simple web app. The auto scaling options are limited, but we can do container groups to have side-cars for checking the main container. 

* Option 3 - If the company has a lot of web apps and is hosting an AKS cluster, we can use that to push this application container into AKS and expose it via the Azure load balancer. 

* Option 4 - We can stick to virtual machines, and have the application deployed as part of a scale set. The scale-set can increse or decrease the amount of virtual machines running behind the Azure load balancer to meet the demand. 

* ** Middle Tier **
* It  is not really clear what the middle tier is actually doing. Is it some kind of a call center application that is pushing customers to a live agent who is getting on the phone to answer the questions? Based on this assumption, we can probably introduce Azure Cognitive and LUIS to setup a knowledge base of the common problems and solutions that we have found, and expose this as a chat-bot. Users can type in their problems into the chat-bot, and that would be matched to the knowledge base to enable a 1st line of defence to solve common problems and reduce customer support load. 

* It looks like we are using the SQL Server database as back-end. The performance seems to be fine. The data volumes are not described as being that large. With that said we can start moving to Azure SQL.  We can target the business critical tier, so that it gives better performance, and read replicas that can be used for reporting type use-cases. Since this is a single region deployment, it does not make sense to do failover groups or active geo-replications. It would be good to setup a long term backup to make sure we can restore the database a reasonable RTO, in case of failures.

* There are no mentions about the data security needs, or the requirement to make sure that the traffic does not go via the public internet. If these are requirements then we can investigate private end-points to connect to the database, and Azure App Environment, or VNET integration to make sure nothing flows between the app and database services using public internet. 