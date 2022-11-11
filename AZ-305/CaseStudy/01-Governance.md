---
casestudy:
    title: 'Design a governance solution'
    module: 'Governance solutions'
---

# Design a governance solution

## Requirements

Tailwind Traders is planning on making some significant changes to their governance solution. They have asked for your assistance with recommendations and questions. Here are the specific requirements.

* **Cost and accounting**. Tailwind Traders has two main business units that handle Apparel and Sporting Goods. Each of the business units consist of three departments: Product Development, Marketing, and Sales. Each business unit and subunit will be responsible for tracking their Azure spend. At the same time, the Enterprise IT team will be responsible for providing company-wide Azure cost reporting.

* **New development project**. The company has a new development project for customer feedback. The CFO wants to ensure all costs associated with the project are captured. For the testing phase, workloads should be hosted on lower cost virtual machines. The virtual machines should be named to indicate they are part of the project. Any instances of non-compliance with resource consistency rules should be automatically identified.

## Tasks

1. **Cost and accounting** 

    * What are different ways Tailwind Traders could organize their subscriptions and management groups. Which would be the best to meet their requirements? 

    * Design two alternative hierarchies and explain your decision-making process.

2. **New development project** 

    * What are the different ways Tailwind Traders could track costs for the new development project?

    * How are you ensuring compliance with the requirements for virtual machine sizing and naming? 

    * Propose at least two ways of meeting the requirements. Explain your final decision. 

How are you incorporating the Well Architected Framework pillars to produce a high quality, stable, and efficient cloud architecture?


## Possible Solution

Company wide spend needs to be tracked. 

One subscription will result in one bill, and costs can be tracked using tags. The downside is that if the company grows fast, we might hit subscription limits. 

We could do one subscription for each business unit and that way we get just 2 bills. We could do tags for subunit to get a cost breakdown. The downside is that we might need to do some customization to aggregate both bills to do company wide cost reporting. If company expands we might hit subscription limits.

To be absolutely safe we could go with 6 subscriptions one for each sub-unit and start grouping these into management groups for easy RBAC and Policy assignments. Since there are 6 bills, we will definitely need to do some automated way of aggregations across these 6 bills to produce company wide cost reporting. 

Tenant Root management Group 

BU1 Management Group.
    Product Development. (sub1)
    Marketing (sub2)
    Sales (sub3)

BU2 Management Group.
    Product Development. (sub4)
    Marketing (sub5)
    Sales (sub6)

New Development Project 
Testing & Development - use low cost machines, should be able to identify machines part of project.
Non compliance has to be identified.

It is hard to tell, from the problem statement, who really owns the development project that is underway. If we can't co-allocate the resources with the sub-unit subscriptions, then we might need to start with a new subscription that gives a separate bill for the development project. This gives the maximum flexibility. Policies can be created to make sure that the virtual machines spawned in this new subscription mandate that they be tagged with the required project identifier. Policies can also be applied to say only specific types of virtual machines, and specific regions are allowed. The policies can be applied to this new subscription and can be used to check and report compliance. The do not ask us to prevent or remediate so the policies have to be coded accordingly. 

If having subs like this is a overkill, we can definitely revise this structure to be resource groups instead of subscriptions and the whole thing becomes a lot simpler to manage. We can have policies applied at each resource group level to mandate tags to be applied to the resource, and if the required tags are not there, we can make them inherit from the resource group and use those to split the billing based on tags. 

So it boils down to how complex the infrastructure is, and whether we will hit the limits of subscriptions. 