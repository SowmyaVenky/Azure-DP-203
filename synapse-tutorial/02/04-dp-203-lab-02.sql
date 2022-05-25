-- https://github.com/MicrosoftLearning/DP-203-Data-Engineer/blob/master/Instructions/Labs/LAB_02_queries_using_serverless_sql_pools.md

-- Run this for exploring data in data lake. SERVERLESS POOL
SELECT
    TransactionDate, ProductId,
        CAST(SUM(ProfitAmount) AS decimal(18,2)) AS [(sum) Profit],
        CAST(AVG(ProfitAmount) AS decimal(18,2)) AS [(avg) Profit],
        SUM(Quantity) AS [(sum) Quantity]
FROM
    OPENROWSET(
        BULK 'https://vksa042772.dfs.core.windows.net/raw042772/wwi-02/sale-small/Year=2016/Quarter=Q3/Month=9/Day=20160930/sale-small-20160930-snappy.parquet',
        FORMAT='PARQUET'
    ) AS [r] GROUP BY r.TransactionDate, r.ProductId;

-- Count records in the other partition SERVERLESS POOL
SELECT
   count(*)
FROM
    OPENROWSET(
        BULK 'https://vksa042772.dfs.core.windows.net/raw042772/wwi-02/sale-small/Year=2019/**',
        FORMAT='PARQUET'
    ) AS [r] 

-- Creating an external table in the DEDICATED pool database to make the analysis long standing
IF NOT EXISTS (SELECT * FROM sys.external_file_formats WHERE name = 'SynapseParquetFormat') 
	CREATE EXTERNAL FILE FORMAT [SynapseParquetFormat] 
	WITH ( FORMAT_TYPE = PARQUET)
GO

IF NOT EXISTS (SELECT * FROM sys.external_data_sources WHERE name = 'raw042772_vksa042772_dfs_core_windows_net') 
	CREATE EXTERNAL DATA SOURCE [raw042772_vksa042772_dfs_core_windows_net] 
	WITH (
		LOCATION = 'abfss://raw042772@vksa042772.dfs.core.windows.net' 
	)
GO

CREATE EXTERNAL TABLE All2019Sales (
	[TransactionId] nvarchar(4000),
	[CustomerId] int,
	[ProductId] smallint,
	[Quantity] smallint,
	[Price] numeric(38,18),
	[TotalAmount] numeric(38,18),
	[TransactionDate] int,
	[ProfitAmount] numeric(38,18),
	[Hour] smallint,
	[Minute] smallint,
	[StoreId] smallint
	)
	WITH (
	LOCATION = 'wwi-02/sale-small/Year=2019/Quarter=Q3/Month=9/Day=20190930/sale-small-20190930-snappy.parquet',
	DATA_SOURCE = [raw042772_vksa042772_dfs_core_windows_net],
	FILE_FORMAT = [SynapseParquetFormat]
	)
GO


SELECT TOP 10 * FROM dbo.All2019Sales
GO

--
-- Accesing file on data lake directly with openrowset. SERVERLESS POOL
SELECT
    TOP 100 *
FROM
    OPENROWSET(
        BULK 'https://vksa042772.dfs.core.windows.net/raw042772/wwi-02/customer-info/customerinfo.csv',
        FORMAT = 'CSV',
        PARSER_VERSION = '2.0'
    ) AS [result]

-- Creating a view to make it easy to use. DEDICATED POOL
create database demo;
GO
use demo;
GO
-- Creating a view to make it easy to use. SERVERLESS POOL
CREATE VIEW CustomerInfo AS
    SELECT * 
FROM OPENROWSET(
        BULK 'https://vksa042772.dfs.core.windows.net/raw042772/wwi-02/customer-info/customerinfo.csv',
        FORMAT = 'CSV',
        PARSER_VERSION = '2.0',
        FIRSTROW=2
    )
    WITH (
    [UserName] NVARCHAR (50),
    [Gender] NVARCHAR (10),
    [Phone] NVARCHAR (50),
    [Email] NVARCHAR (100),
    [CreditCard] NVARCHAR (50)
    ) AS [r];

GO

SELECT TOP 10 *
FROM
CustomerInfo

-- Use SAS key to load data from external storage.  SERVERLESS POOL

IF NOT EXISTS (SELECT * FROM sys.symmetric_keys) BEGIN
    declare @pasword nvarchar(400) = CAST(newid() as VARCHAR(400));
    EXEC('CREATE MASTER KEY ENCRYPTION BY PASSWORD = ''' + @pasword + '''')
END

CREATE DATABASE SCOPED CREDENTIAL [sqlondemand]
WITH IDENTITY='SHARED ACCESS SIGNATURE',  
SECRET = 'sv=2018-03-28&ss=bf&srt=sco&sp=rl&st=2019-10-14T12%3A10%3A25Z&se=2061-12-31T12%3A10%3A00Z&sig=KlSU2ullCscyTS0An0nozEpo4tO5JAgGBvw%2FJX2lguw%3D'
GO

-- Create external data source secured using credential
CREATE EXTERNAL DATA SOURCE SqlOnDemandDemo WITH (
    LOCATION = 'https://sqlondemandstorage.blob.core.windows.net/',
    CREDENTIAL = sqlondemand
);
GO

CREATE EXTERNAL FILE FORMAT QuotedCsvWithHeader
WITH (  
    FORMAT_TYPE = DELIMITEDTEXT,
    FORMAT_OPTIONS (
        FIELD_TERMINATOR = ',',
        STRING_DELIMITER = '"',
        FIRST_ROW = 2
    )
);
GO

CREATE EXTERNAL TABLE [population]
(
    [country_code] VARCHAR (5) COLLATE Latin1_General_BIN2,
    [country_name] VARCHAR (100) COLLATE Latin1_General_BIN2,
    [year] smallint,
    [population] bigint
)
WITH (
    LOCATION = 'csv/population/population.csv',
    DATA_SOURCE = SqlOnDemandDemo,
    FILE_FORMAT = QuotedCsvWithHeader
);
GO

SELECT [country_code]
    ,[country_name]
    ,[year]
    ,[population]
FROM [dbo].[population]
WHERE [year] = 2019 and population > 100000000
