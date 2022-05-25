-- Follow this tutorial
-- https://github.com/MicrosoftLearning/DP-203-Data-Engineer/blob/master/Instructions/Labs/LAB_05_load_data_into_the_data_warehouse.md

-- Note round robin distribution, because staging tables are not queried directly.
create schema [wwi_staging];
GO
CREATE TABLE [wwi_staging].[SaleHeap]
( 
    [TransactionId] [uniqueidentifier]  NOT NULL,
    [CustomerId] [int]  NOT NULL,
    [ProductId] [smallint]  NOT NULL,
    [Quantity] [smallint]  NOT NULL,
    [Price] [decimal](9,2)  NOT NULL,
    [TotalAmount] [decimal](9,2)  NOT NULL,
    [TransactionDate] [int]  NOT NULL,
    [ProfitAmount] [decimal](9,2)  NOT NULL,
    [Hour] [tinyint]  NOT NULL,
    [Minute] [tinyint]  NOT NULL,
    [StoreId] [smallint]  NOT NULL
)
WITH
(
    DISTRIBUTION = ROUND_ROBIN,
    HEAP
);
GO
-- Create another table to see whether the load characteristics change based on table def.
-- Use range based partitions to partition the data by date.
CREATE TABLE [wwi_staging].[Sale]
(
    [TransactionId] [uniqueidentifier]  NOT NULL,
    [CustomerId] [int]  NOT NULL,
    [ProductId] [smallint]  NOT NULL,
    [Quantity] [smallint]  NOT NULL,
    [Price] [decimal](9,2)  NOT NULL,
    [TotalAmount] [decimal](9,2)  NOT NULL,
    [TransactionDate] [int]  NOT NULL,
    [ProfitAmount] [decimal](9,2)  NOT NULL,
    [Hour] [tinyint]  NOT NULL,
    [Minute] [tinyint]  NOT NULL,
    [StoreId] [smallint]  NOT NULL
)
WITH
(
    DISTRIBUTION = HASH ( [CustomerId] ),
    CLUSTERED COLUMNSTORE INDEX,
    PARTITION
    (
        [TransactionDate] RANGE RIGHT FOR VALUES (20100101, 20100201, 20100301, 20100401, 20100501, 20100601, 20100701, 20100801, 20100901, 20101001, 20101101, 20101201, 20110101, 20110201, 20110301, 20110401, 20110501, 20110601, 20110701, 20110801, 20110901, 20111001, 20111101, 20111201, 20120101, 20120201, 20120301, 20120401, 20120501, 20120601, 20120701, 20120801, 20120901, 20121001, 20121101, 20121201, 20130101, 20130201, 20130301, 20130401, 20130501, 20130601, 20130701, 20130801, 20130901, 20131001, 20131101, 20131201, 20140101, 20140201, 20140301, 20140401, 20140501, 20140601, 20140701, 20140801, 20140901, 20141001, 20141101, 20141201, 20150101, 20150201, 20150301, 20150401, 20150501, 20150601, 20150701, 20150801, 20150901, 20151001, 20151101, 20151201, 20160101, 20160201, 20160301, 20160401, 20160501, 20160601, 20160701, 20160801, 20160901, 20161001, 20161101, 20161201, 20170101, 20170201, 20170301, 20170401, 20170501, 20170601, 20170701, 20170801, 20170901, 20171001, 20171101, 20171201, 20180101, 20180201, 20180301, 20180401, 20180501, 20180601, 20180701, 20180801, 20180901, 20181001, 20181101, 20181201, 20190101, 20190201, 20190301, 20190401, 20190501, 20190601, 20190701, 20190801, 20190901, 20191001, 20191101, 20191201)
    )
)
GO
-- POLYBase load. This has limitations noted. Can't support custom delimiters etc. All data has to end in LF etc.
-- Create an external data source to make it easier for subsequent queries.
-- Replace SUFFIX with the lab workspace id.
CREATE EXTERNAL DATA SOURCE ABSS
WITH
( TYPE = HADOOP,
    LOCATION = 'abfss://raw042772@vksa042772.dfs.core.windows.net/wwi-02/'
);
GO
-- Create the parquet file format. 
CREATE EXTERNAL FILE FORMAT [ParquetFormat]
WITH (
    FORMAT_TYPE = PARQUET,
    DATA_COMPRESSION = 'org.apache.hadoop.io.compress.SnappyCodec'
)
GO
-- Create a schema to host external tables.
CREATE SCHEMA [wwi_external];
GO
-- Create table def.
CREATE EXTERNAL TABLE [wwi_external].Sales
    (
        [TransactionId] [nvarchar](36)  NOT NULL,
        [CustomerId] [int]  NOT NULL,
        [ProductId] [smallint]  NOT NULL,
        [Quantity] [smallint]  NOT NULL,
        [Price] [decimal](9,2)  NOT NULL,
        [TotalAmount] [decimal](9,2)  NOT NULL,
        [TransactionDate] [int]  NOT NULL,
        [ProfitAmount] [decimal](9,2)  NOT NULL,
        [Hour] [tinyint]  NOT NULL,
        [Minute] [tinyint]  NOT NULL,
        [StoreId] [smallint]  NOT NULL
    )
WITH
    (
        LOCATION = '/sale-small/Year=2019',  
        DATA_SOURCE = ABSS,
        FILE_FORMAT = [ParquetFormat]  
    )  
GO
-- Insert data 
INSERT INTO [wwi_staging].[SaleHeap]
SELECT *
FROM [wwi_external].[Sales]
GO
SELECT COUNT(1) FROM wwi_staging.SaleHeap(nolock)
GO
-- Now same task with copy command not polybase, gives more flexibility

TRUNCATE TABLE wwi_staging.SaleHeap;
GO

-- Replace SUFFIX with the unique suffix for your resources
COPY INTO wwi_staging.SaleHeap
FROM 'https://vksa042772.dfs.core.windows.net/raw042772/wwi-02/sale-small/Year=2019/'
WITH (
    FILE_TYPE = 'PARQUET',
    COMPRESSION = 'SNAPPY'
)
GO
SELECT COUNT(1) FROM wwi_staging.SaleHeap(nolock)
GO
-- COPY command with non-standard delimiters.
CREATE TABLE [wwi_staging].DailySalesCounts
    (
        [Date] [int]  NOT NULL,
        [NorthAmerica] [int]  NOT NULL,
        [SouthAmerica] [int]  NOT NULL,
        [Europe] [int]  NOT NULL,
        [Africa] [int]  NOT NULL,
        [Asia] [int]  NOT NULL
    )
GO

-- Replace SUFFIX with the unique suffix for your resources
COPY INTO wwi_staging.DailySalesCounts
FROM 'https://vksa042772.dfs.core.windows.net/raw042772/wwi-02/campaign-analytics/dailycounts.txt'
WITH (
    FILE_TYPE = 'CSV',
    FIELDTERMINATOR='.',
    ROWTERMINATOR=','
)
GO
-- Query & visualize
SELECT * FROM [wwi_staging].DailySalesCounts
ORDER BY [Date] DESC
GO
-- WORKLOAD MANAGEMENT STARTS HERE. Default accounts do not have the capacity for large loads.
-- Drop objects if they exist
IF EXISTS (SELECT * FROM sys.workload_management_workload_classifiers WHERE [name] = 'HeavyLoader')
BEGIN
    DROP WORKLOAD CLASSIFIER HeavyLoader
END;

IF EXISTS (SELECT * FROM sys.workload_management_workload_groups WHERE name = 'BigDataLoad')
BEGIN
    DROP WORKLOAD GROUP BigDataLoad
END;

--Create workload group
CREATE WORKLOAD GROUP BigDataLoad WITH
  (
      MIN_PERCENTAGE_RESOURCE = 50, -- integer value
      REQUEST_MIN_RESOURCE_GRANT_PERCENT = 25, --  (guaranteed min 4 concurrency)
      CAP_PERCENTAGE_RESOURCE = 100
  );

--Create the user we need to do the performant load.
-- NEED TO RUN THIS ON THE MASTER DB --
create login [asa.sql.import01] with password = 'Ganesh20022002';

create user [asa.sql.import01] for login [asa.sql.import01]
execute sp_addrolemember 'db_owner', 'asa.sql.import01'  

-- Create workload classifier
CREATE WORKLOAD Classifier HeavyLoader WITH
(
    Workload_Group ='BigDataLoad',
    MemberName='asa.sql.import01',
    IMPORTANCE = HIGH
);

-- View classifiers
SELECT * FROM sys.workload_management_workload_classifiers

-- Create the schema and the target table used to put data via the heavy load user.
IF OBJECT_ID(N'[wwi_perf].[Sale_Heap]', N'U') IS NOT NULL   
DROP TABLE [wwi_perf].[Sale_Heap]  

CREATE SCHEMA wwi_perf;

CREATE TABLE [wwi_perf].[Sale_Heap]
( 
	[TransactionId] [uniqueidentifier]  NOT NULL,
	[CustomerId] [int]  NOT NULL,
	[ProductId] [smallint]  NOT NULL,
	[Quantity] [tinyint]  NOT NULL,
	[Price] [decimal](9,2)  NOT NULL,
	[TotalAmount] [decimal](9,2)  NOT NULL,
	[TransactionDateId] [int]  NOT NULL,
	[ProfitAmount] [decimal](9,2)  NOT NULL,
	[Hour] [tinyint]  NOT NULL,
	[Minute] [tinyint]  NOT NULL,
	[StoreId] [smallint]  NOT NULL
)
WITH
(
	DISTRIBUTION = ROUND_ROBIN,
	HEAP
)

-- Now continue the process of building a copy job via ADF, and make sure the user is set to 
-- asa.sql.import01 to get the advantages of the capacity management we setup.
-- After the pipeline runs it will pull data from the data lake and put it on the DW via the linked service
-- pointing to synapse and the target table. Once load is done, confirm

SELECT COUNT(1) FROM [wwi_perf].[Sale_Heap]