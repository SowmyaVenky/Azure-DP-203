-- Follow lab from here 
-- https://github.com/MicrosoftLearning/DP-203-Data-Engineer/blob/master/Instructions/Labs/LAB_06_transform_data_with_pipelines.md

--This lab expects a cosmos db is provisioned, and the data is loaded. The actual lab runs a pipeline 
-- to take the data from the data lake and then pushes it to cosmosdb. 

-- Here we have to execute the powershell to create the cosmos db instance. This will use the ARM template
-- in the arm-templates/cosmosdb folder.

-- There are about 100K rows that will be in the data lake for us to use. These are in JSON formmat.
-- The pipeline I developed manually is exported as a zipfile and stored under the synapse-pipeline-templates
-- Once Synapse is provisioned, we need to import that in via the Integrate tab.
-- The load to cosmos is pretty slow - takes about 45 mins.

-- Create a schema
CREATE SCHEMA [wwi];
GO
CREATE TABLE [wwi].[CampaignAnalytics]
(
    [Region] [nvarchar](50)  NOT NULL,
    [Country] [nvarchar](30)  NOT NULL,
    [ProductCategory] [nvarchar](50)  NOT NULL,
    [CampaignName] [nvarchar](500)  NOT NULL,
    [Revenue] [decimal](10,2)  NULL,
    [RevenueTarget] [decimal](10,2)  NULL,
    [City] [nvarchar](50)  NULL,
    [State] [nvarchar](25)  NULL
)
WITH
(
    DISTRIBUTION = HASH ( [Region] ),
    CLUSTERED COLUMNSTORE INDEX
)
GO
CREATE TABLE [wwi].[UserTopProductPurchases]
(
    [UserId] [int]  NOT NULL,
    [ProductId] [int]  NOT NULL,
    [ItemsPurchasedLast12Months] [int]  NULL,
    [IsTopProduct] [bit]  NOT NULL,
    [IsPreferredProduct] [bit]  NOT NULL
)
WITH
(
    DISTRIBUTION = HASH ( [UserId] ),
    CLUSTERED COLUMNSTORE INDEX
)
-- We need to create linked services to connect to the right inputs and outputs.
-- Develop the data flow.
-- create a pipeline to use that flow.
-- Trigger and monitor pipeline.
-- Check 2 synapse tables for content.
-- check the datalake target to check for content. 
