---
casestudy:
    title: 'Design an app architecture solution'
    module: 'App architecture solutions'
---
# Design an app architecture solution

## Requirements

Tailwind Traders is looking to update their website to include customer supplied product images in addition to the already existing photos provided by marketing. They believe that having more photos of products in use will give potential customers a better feel for how past customers loved their products after purchasing them. They do have some requirements as outlined below:

* Uploaded images will need to be scanned before getting posted on the website. Legal and Marketing are both requesting that after initial upload, the images be checked for any issues that reflect poorly upon the company or could cause legal issues. An in-house API has already been developed and deployed that can perform the necessary scanning. 
    * The website is being updated to give image upload functionality to the users. Once the user uploads the images to the system, we need to store it in a staging blob storage location where we can investigate it further. Since the upload has to start off the investigation process, we are looking at some kind of an eventing and workflow system. This workflow should be capable of calling the in-house developed API and decide the next course of action based on what the API returns. All of this hints to using a logic apps process that gets triggered based on events generated on blob storage.
    * Since there is a need to send emails, and call REST APIs we need to define connectors to enable logic apps to use them. 
    * As shown in the diagram below, we can see that blob storage can fire events into an event grid. A logic app can be triggered based on this event. There are however other gotchas to be aware of as described here https://learn.microsoft.com/en-us/azure/logic-apps/logic-apps-create-api-app
    * ![BI Landscape](media/event-grid-functional-model.png)

* Based on existing patterns, Tailwind Traders expects the image uploads to happen very unevenly throughout the day. Certain periods may experience more uploads than the scanning software can handle, while other periods may experience very few or no uploads.
    * Since we are using serverless functions, this is automatically taken care of. Scaling and payments are all based on the number of events we process.

* Once an uploaded image has been scanned and approved by the system, Tailwind Traders would like for the customer to be sent an email thanking them for sharing their image.
    * The decision based logic and emailing can be handled natively via logic apps. This might need some kind of connection to make sure we have a datastore that keeps track of user emails by uploaded blob. This needs to be looked up before we can send the email to the user thanking them. This might have implictions on the type of storage we need since the volumes might be pretty high since uploads are exposed to all users.

* Cost and management of the solution is a concern, especially since Tailwind Traders isn’t sure how popular this feature will be initially. Minimize costs and leverage serverless solutions where possible.
    * This is also taken care of. We are not having any infrastructure running to support this functionality, so it is already optimized as much as we can. 

 

![App architecture](media/Apparchitecture.png)

 

## Task

Design an architecture for the customer images to be added to the company website. 

* Where should the images be stored?
    * The best storage for this would be a general purpose v2 account with blob storage containers. The blob storage allows us to store lots of data, and supports life cycle rules to automatically move these blobs to various tiers as they age. Storage policies can also be written to check the age of the blob and delete it as needed.

* How will you ensure that all images are scanned even when uploads are outpacing scanning?
    * Since we are using event grid to get events from the blob storage it has in-built message persistence. Event grid has the delivery guarantee of at least once to its subscribers. This makes the solution reliable in that it will not miss scanning images even if the API is a bit slower. Since logic apps are stateful, it can re-poll and continue as needed. 

* Once images are approved and the catalog database is updated, how will the customer be notified? 
    * Logic apps have connectors to send emails, and databases. Using this, we can lookup the customer email after approvals and emails can be sent. If we do not want to couple all this we can have events fired from the database after updates happen, and a email sending workflow can take care of emailing in a separate workflow. This makes the solution more stateless.

How are you incorporating the Well Architected Framework pillars to produce a high quality, stable, and efficient cloud architecture?

 
