-- Replace the data lake URLs correctly to match the exact paths based on what has been generaed by the ARM template.
-- Read all the sales csv files across multiple years.
-- We need to create a linked service to allow Synapse get to the files we have on the ADLS storage
-- account that is NOT PRIMARY to the synapse workspace. We go to Data -> click on the + button, and 
-- then connect to external data... After we fill out the required details, a linked service will be 
-- created and will allow synapse to connect and pull data.

-- The first time we add the linked service, it will not show up on the left nav of synapse. we need 
-- to click the 3 dots and hit refresh to reveal the new linked sevice to show up. 

-- If we do not do that it will not work. Note be on SERVERLESS POOL - These are exploratory.
SELECT
    TOP 100 *
FROM
    OPENROWSET(
        BULK 'https://vksa1086099719.dfs.core.windows.net/raw1086099719/wwi-02/synapse-tutorial/02/sales/csv/**',
        FORMAT = 'CSV',
        PARSER_VERSION = '2.0'
    ) AS [result]

-- Note that the columns are not recognized and they are named C1, C2 etc.
-- Now use WITH to give structure for the data read from the file. Note collate on fields.
SELECT
    TOP 100 *
FROM
    OPENROWSET(
        BULK 'https://vksa1086099719.dfs.core.windows.net/raw1086099719/wwi-02/synapse-tutorial/02/sales/csv/**',
        FORMAT = 'CSV',
        PARSER_VERSION='2.0'
    )
    WITH (
        SalesOrderNumber VARCHAR(10) COLLATE Latin1_General_100_BIN2_UTF8,
        SalesOrderLineNumber INT,
        OrderDate DATE,
        CustomerName VARCHAR(25) COLLATE Latin1_General_100_BIN2_UTF8,
        EmailAddress VARCHAR(50) COLLATE Latin1_General_100_BIN2_UTF8,
        Item VARCHAR(30) COLLATE Latin1_General_100_BIN2_UTF8,
        Quantity INT,
        UnitPrice DECIMAL(18,2),
        TaxAmount DECIMAL (18,2)
    ) AS [result]

-- Now query the parquet files in the folder that are partitioned by date. Note ** at end.
-- This will include all the sub-folders.
SELECT
    TOP 100 *
FROM
    OPENROWSET(
        BULK 'https://vksa1086099719.dfs.core.windows.net/raw1086099719/wwi-02/synapse-tutorial/02/sales/parquet/**',
        FORMAT = 'PARQUET'
    ) AS [result]

-- Query aggreate from all folders.
SELECT YEAR(OrderDate) AS OrderYear,
       COUNT(*) AS OrdredItems
FROM
    OPENROWSET(
        BULK 'https://vksa1086099719.dfs.core.windows.net/raw1086099719/wwi-02/synapse-tutorial/02/sales/parquet/**',
        FORMAT = 'PARQUET'
    ) AS [result]
GROUP BY YEAR(OrderDate)
ORDER BY OrderYear

-- Note the way to query based on file path. Only 2019 and 2020 
SELECT YEAR(OrderDate) AS OrderYear,
       COUNT(*) AS OrdredItems
FROM
    OPENROWSET(
        BULK 'https://vksa1086099719.dfs.core.windows.net/raw1086099719/wwi-02/synapse-tutorial/02/sales/parquet/year=*/**',
        FORMAT = 'PARQUET'
    ) AS [result]
WHERE [result].filepath(1) IN ('2019', '2020')
GROUP BY YEAR(OrderDate)
ORDER BY OrderYear

-- Query sales orders in JSON format. Note use of CSV even when we read JSON
SELECT
    TOP 100 *
FROM
    OPENROWSET(
        BULK 'https://vksa1086099719.dfs.core.windows.net/raw1086099719/wwi-02/synapse-tutorial/02/sales/json/**',
        FORMAT = 'CSV',
        FIELDTERMINATOR ='0x0b',
        FIELDQUOTE = '0x0b',
        ROWTERMINATOR = '0x0b'
    ) WITH (Doc NVARCHAR(MAX)) as rows

--Now use JSON functions to get specific elements from JSON
SELECT JSON_VALUE(Doc, '$.SalesOrderNumber') AS OrderNumber,
       JSON_VALUE(Doc, '$.CustomerName') AS Customer,
       Doc
FROM
    OPENROWSET(
        BULK 'https://vksa1086099719.dfs.core.windows.net/raw1086099719/wwi-02/synapse-tutorial/02/sales/json/**',
        FORMAT = 'CSV',
        FIELDTERMINATOR ='0x0b',
        FIELDQUOTE = '0x0b',
        ROWTERMINATOR = '0x0b'
    ) WITH (Doc NVARCHAR(MAX)) as rows

-- NEXT PART makes this way easier by creating a database, external format, external datasource etc.
-- RUN AGAINST MASTER
CREATE DATABASE Sales
  COLLATE Latin1_General_100_BIN2_UTF8;
GO;

Use Sales;
GO;

CREATE EXTERNAL DATA SOURCE sales_data WITH (
    LOCATION = 'https://vksa1086099719.dfs.core.windows.net/raw1086099719/wwi-02/synapse-tutorial/02/sales/'
);
GO;

-- NOW SWITCH TO THE SALES DB to create the other artifacts inside sales db, not master.
-- RELATIVE paths are being used now.

SELECT *
FROM
    OPENROWSET(
        BULK 'csv/*.csv',
        DATA_SOURCE = 'sales_data',
        FORMAT = 'CSV',
        PARSER_VERSION = '2.0'
    ) AS orders

SELECT *
FROM  
    OPENROWSET(
        BULK 'parquet/year=*/*.snappy.parquet',
        DATA_SOURCE = 'sales_data',
        FORMAT='PARQUET'
    ) AS orders
WHERE orders.filepath(1) = '2019'

-- EXTERNAL TABLE Create
CREATE EXTERNAL FILE FORMAT CsvFormat
    WITH (
        FORMAT_TYPE = DELIMITEDTEXT,
        FORMAT_OPTIONS(
        FIELD_TERMINATOR = ',',
        STRING_DELIMITER = '"'
        )
    );
GO;

CREATE EXTERNAL TABLE dbo.orders
(
    SalesOrderNumber VARCHAR(10),
    SalesOrderLineNumber INT,
    OrderDate DATE,
    CustomerName VARCHAR(25),
    EmailAddress VARCHAR(50),
    Item VARCHAR(30),
    Quantity INT,
    UnitPrice DECIMAL(18,2),
    TaxAmount DECIMAL (18,2)
)
WITH
(
    DATA_SOURCE =sales_data,
    LOCATION = 'csv/*.csv',
    FILE_FORMAT = CsvFormat
);
GO

-- Now query external table,
SELECT YEAR(OrderDate) AS OrderYear,
       SUM((UnitPrice * Quantity) + TaxAmount) AS GrossRevenue
FROM dbo.orders
GROUP BY YEAR(OrderDate)
ORDER BY OrderYear;