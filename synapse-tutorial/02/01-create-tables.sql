CREATE EXTERNAL DATA SOURCE WWIStorage
WITH
(
    TYPE = Hadoop,
    LOCATION = 'wasbs://wideworldimporters@sqldwholdata.blob.core.windows.net'
);
go
CREATE EXTERNAL FILE FORMAT TextFileFormat
WITH
(
    FORMAT_TYPE = DELIMITEDTEXT,
    FORMAT_OPTIONS
    (
        FIELD_TERMINATOR = '|',
        USE_TYPE_DEFAULT = FALSE
    )
);
go
CREATE SCHEMA ext;
GO
CREATE SCHEMA wwi;
GO
CREATE EXTERNAL TABLE [ext].[dimension_City](
    [City Key] [int] NOT NULL,
    [WWI City ID] [int] NOT NULL,
    [City] [nvarchar](50) NOT NULL,
    [State Province] [nvarchar](50) NOT NULL,
    [Country] [nvarchar](60) NOT NULL,
    [Continent] [nvarchar](30) NOT NULL,
    [Sales Territory] [nvarchar](50) NOT NULL,
    [Region] [nvarchar](30) NOT NULL,
    [Subregion] [nvarchar](30) NOT NULL,
    [Location] [nvarchar](76) NULL,
    [Latest Recorded Population] [bigint] NOT NULL,
    [Valid From] [datetime2](7) NOT NULL,
    [Valid To] [datetime2](7) NOT NULL,
    [Lineage Key] [int] NOT NULL
)
WITH (LOCATION='/v1/dimension_City/',
    DATA_SOURCE = WWIStorage,  
    FILE_FORMAT = TextFileFormat,
    REJECT_TYPE = VALUE,
    REJECT_VALUE = 0
);  
CREATE EXTERNAL TABLE [ext].[dimension_Customer] (
    [Customer Key] [int] NOT NULL,
    [WWI Customer ID] [int] NOT NULL,
    [Customer] [nvarchar](100) NOT NULL,
    [Bill To Customer] [nvarchar](100) NOT NULL,
       [Category] [nvarchar](50) NOT NULL,
    [Buying Group] [nvarchar](50) NOT NULL,
    [Primary Contact] [nvarchar](50) NOT NULL,
    [Postal Code] [nvarchar](10) NOT NULL,
    [Valid From] [datetime2](7) NOT NULL,
    [Valid To] [datetime2](7) NOT NULL,
    [Lineage Key] [int] NOT NULL
)
WITH (LOCATION='/v1/dimension_Customer/',
    DATA_SOURCE = WWIStorage,  
    FILE_FORMAT = TextFileFormat,
    REJECT_TYPE = VALUE,
    REJECT_VALUE = 0
);  
CREATE EXTERNAL TABLE [ext].[dimension_Employee] (
    [Employee Key] [int] NOT NULL,
    [WWI Employee ID] [int] NOT NULL,
    [Employee] [nvarchar](50) NOT NULL,
    [Preferred Name] [nvarchar](50) NOT NULL,
    [Is Salesperson] [bit] NOT NULL,
    [Photo] [varbinary](300) NULL,
    [Valid From] [datetime2](7) NOT NULL,
    [Valid To] [datetime2](7) NOT NULL,
    [Lineage Key] [int] NOT NULL
)
WITH ( LOCATION='/v1/dimension_Employee/',
    DATA_SOURCE = WWIStorage,  
    FILE_FORMAT = TextFileFormat,
    REJECT_TYPE = VALUE,
    REJECT_VALUE = 0
);
CREATE EXTERNAL TABLE [ext].[dimension_PaymentMethod] (
    [Payment Method Key] [int] NOT NULL,
    [WWI Payment Method ID] [int] NOT NULL,
    [Payment Method] [nvarchar](50) NOT NULL,
    [Valid From] [datetime2](7) NOT NULL,
    [Valid To] [datetime2](7) NOT NULL,
    [Lineage Key] [int] NOT NULL
)
WITH ( LOCATION ='/v1/dimension_PaymentMethod/',
    DATA_SOURCE = WWIStorage,  
    FILE_FORMAT = TextFileFormat,
    REJECT_TYPE = VALUE,
    REJECT_VALUE = 0
);
CREATE EXTERNAL TABLE [ext].[dimension_StockItem](
    [Stock Item Key] [int] NOT NULL,
    [WWI Stock Item ID] [int] NOT NULL,
    [Stock Item] [nvarchar](100) NOT NULL,
    [Color] [nvarchar](20) NOT NULL,
    [Selling Package] [nvarchar](50) NOT NULL,
    [Buying Package] [nvarchar](50) NOT NULL,
    [Brand] [nvarchar](50) NOT NULL,
    [Size] [nvarchar](20) NOT NULL,
    [Lead Time Days] [int] NOT NULL,
    [Quantity Per Outer] [int] NOT NULL,
    [Is Chiller Stock] [bit] NOT NULL,
    [Barcode] [nvarchar](50) NULL,
    [Tax Rate] [decimal](18, 3) NOT NULL,
    [Unit Price] [decimal](18, 2) NOT NULL,
    [Recommended Retail Price] [decimal](18, 2) NULL,
    [Typical Weight Per Unit] [decimal](18, 3) NOT NULL,
    [Photo] [varbinary](300) NULL,
    [Valid From] [datetime2](7) NOT NULL,
    [Valid To] [datetime2](7) NOT NULL,
    [Lineage Key] [int] NOT NULL
)
WITH ( LOCATION ='/v1/dimension_StockItem/',
    DATA_SOURCE = WWIStorage,  
    FILE_FORMAT = TextFileFormat,
    REJECT_TYPE = VALUE,
    REJECT_VALUE = 0
);
CREATE EXTERNAL TABLE [ext].[dimension_Supplier](
    [Supplier Key] [int] NOT NULL,
    [WWI Supplier ID] [int] NOT NULL,
    [Supplier] [nvarchar](100) NOT NULL,
    [Category] [nvarchar](50) NOT NULL,
    [Primary Contact] [nvarchar](50) NOT NULL,
    [Supplier Reference] [nvarchar](20) NULL,
    [Payment Days] [int] NOT NULL,
    [Postal Code] [nvarchar](10) NOT NULL,
    [Valid From] [datetime2](7) NOT NULL,
    [Valid To] [datetime2](7) NOT NULL,
    [Lineage Key] [int] NOT NULL
)
WITH ( LOCATION ='/v1/dimension_Supplier/',
    DATA_SOURCE = WWIStorage,  
    FILE_FORMAT = TextFileFormat,
    REJECT_TYPE = VALUE,
    REJECT_VALUE = 0
);
CREATE EXTERNAL TABLE [ext].[dimension_TransactionType](
    [Transaction Type Key] [int] NOT NULL,
    [WWI Transaction Type ID] [int] NOT NULL,
    [Transaction Type] [nvarchar](50) NOT NULL,
    [Valid From] [datetime2](7) NOT NULL,
    [Valid To] [datetime2](7) NOT NULL,
    [Lineage Key] [int] NOT NULL
)
WITH ( LOCATION ='/v1/dimension_TransactionType/',
    DATA_SOURCE = WWIStorage,  
    FILE_FORMAT = TextFileFormat,
    REJECT_TYPE = VALUE,
    REJECT_VALUE = 0
);
CREATE EXTERNAL TABLE [ext].[fact_Movement] (
    [Movement Key] [bigint] NOT NULL,
    [Date Key] [date] NOT NULL,
    [Stock Item Key] [int] NOT NULL,
    [Customer Key] [int] NULL,
    [Supplier Key] [int] NULL,
    [Transaction Type Key] [int] NOT NULL,
    [WWI Stock Item Transaction ID] [int] NOT NULL,
    [WWI Invoice ID] [int] NULL,
    [WWI Purchase Order ID] [int] NULL,
    [Quantity] [int] NOT NULL,
    [Lineage Key] [int] NOT NULL
)
WITH ( LOCATION ='/v1/fact_Movement/',
    DATA_SOURCE = WWIStorage,  
    FILE_FORMAT = TextFileFormat,
    REJECT_TYPE = VALUE,
    REJECT_VALUE = 0
);
CREATE EXTERNAL TABLE [ext].[fact_Order] (
    [Order Key] [bigint] NOT NULL,
    [City Key] [int] NOT NULL,
    [Customer Key] [int] NOT NULL,
    [Stock Item Key] [int] NOT NULL,
    [Order Date Key] [date] NOT NULL,
    [Picked Date Key] [date] NULL,
    [Salesperson Key] [int] NOT NULL,
    [Picker Key] [int] NULL,
    [WWI Order ID] [int] NOT NULL,
    [WWI Backorder ID] [int] NULL,
    [Description] [nvarchar](100) NOT NULL,
    [Package] [nvarchar](50) NOT NULL,
    [Quantity] [int] NOT NULL,
    [Unit Price] [decimal](18, 2) NOT NULL,
    [Tax Rate] [decimal](18, 3) NOT NULL,
    [Total Excluding Tax] [decimal](18, 2) NOT NULL,
    [Tax Amount] [decimal](18, 2) NOT NULL,
    [Total Including Tax] [decimal](18, 2) NOT NULL,
    [Lineage Key] [int] NOT NULL
)
WITH ( LOCATION ='/v1/fact_Order/',
    DATA_SOURCE = WWIStorage,
    FILE_FORMAT = TextFileFormat,
    REJECT_TYPE = VALUE,
    REJECT_VALUE = 0
);
CREATE EXTERNAL TABLE [ext].[fact_Purchase] (
    [Purchase Key] [bigint] NOT NULL,
    [Date Key] [date] NOT NULL,
    [Supplier Key] [int] NOT NULL,
    [Stock Item Key] [int] NOT NULL,
    [WWI Purchase Order ID] [int] NULL,
    [Ordered Outers] [int] NOT NULL,
    [Ordered Quantity] [int] NOT NULL,
    [Received Outers] [int] NOT NULL,
    [Package] [nvarchar](50) NOT NULL,
    [Is Order Finalized] [bit] NOT NULL,
    [Lineage Key] [int] NOT NULL
)
WITH ( LOCATION ='/v1/fact_Purchase/',
    DATA_SOURCE = WWIStorage,  
    FILE_FORMAT = TextFileFormat,
    REJECT_TYPE = VALUE,
    REJECT_VALUE = 0
);
CREATE EXTERNAL TABLE [ext].[fact_Sale] (
    [Sale Key] [bigint] NOT NULL,
    [City Key] [int] NOT NULL,
    [Customer Key] [int] NOT NULL,
    [Bill To Customer Key] [int] NOT NULL,
    [Stock Item Key] [int] NOT NULL,
    [Invoice Date Key] [date] NOT NULL,
    [Delivery Date Key] [date] NULL,
    [Salesperson Key] [int] NOT NULL,
    [WWI Invoice ID] [int] NOT NULL,
    [Description] [nvarchar](100) NOT NULL,
    [Package] [nvarchar](50) NOT NULL,
    [Quantity] [int] NOT NULL,
    [Unit Price] [decimal](18, 2) NOT NULL,
    [Tax Rate] [decimal](18, 3) NOT NULL,
    [Total Excluding Tax] [decimal](18, 2) NOT NULL,
    [Tax Amount] [decimal](18, 2) NOT NULL,
    [Profit] [decimal](18, 2) NOT NULL,
    [Total Including Tax] [decimal](18, 2) NOT NULL,
    [Total Dry Items] [int] NOT NULL,
    [Total Chiller Items] [int] NOT NULL,
    [Lineage Key] [int] NOT NULL
)
WITH ( LOCATION ='/v1/fact_Sale/',
    DATA_SOURCE = WWIStorage,  
    FILE_FORMAT = TextFileFormat,
    REJECT_TYPE = VALUE,
    REJECT_VALUE = 0
);
CREATE EXTERNAL TABLE [ext].[fact_StockHolding] (
    [Stock Holding Key] [bigint] NOT NULL,
    [Stock Item Key] [int] NOT NULL,
    [Quantity On Hand] [int] NOT NULL,
    [Bin Location] [nvarchar](20) NOT NULL,
    [Last Stocktake Quantity] [int] NOT NULL,
    [Last Cost Price] [decimal](18, 2) NOT NULL,
    [Reorder Level] [int] NOT NULL,
    [Target Stock Level] [int] NOT NULL,
    [Lineage Key] [int] NOT NULL
)
WITH ( LOCATION ='/v1/fact_StockHolding/',
    DATA_SOURCE = WWIStorage,  
    FILE_FORMAT = TextFileFormat,
    REJECT_TYPE = VALUE,
    REJECT_VALUE = 0
);
CREATE EXTERNAL TABLE [ext].[fact_Transaction] (
    [Transaction Key] [bigint] NOT NULL,
    [Date Key] [date] NOT NULL,
    [Customer Key] [int] NULL,
    [Bill To Customer Key] [int] NULL,
    [Supplier Key] [int] NULL,
    [Transaction Type Key] [int] NOT NULL,
    [Payment Method Key] [int] NULL,
    [WWI Customer Transaction ID] [int] NULL,
    [WWI Supplier Transaction ID] [int] NULL,
    [WWI Invoice ID] [int] NULL,
    [WWI Purchase Order ID] [int] NULL,
    [Supplier Invoice Number] [nvarchar](20) NULL,
    [Total Excluding Tax] [decimal](18, 2) NOT NULL,
    [Tax Amount] [decimal](18, 2) NOT NULL,
    [Total Including Tax] [decimal](18, 2) NOT NULL,
    [Outstanding Balance] [decimal](18, 2) NOT NULL,
    [Is Finalized] [bit] NOT NULL,
    [Lineage Key] [int] NOT NULL
)
WITH ( LOCATION ='/v1/fact_Transaction/',
    DATA_SOURCE = WWIStorage,  
    FILE_FORMAT = TextFileFormat,
    REJECT_TYPE = VALUE,
    REJECT_VALUE = 0
);