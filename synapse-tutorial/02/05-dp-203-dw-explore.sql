-- https://github.com/MicrosoftLearning/DP-203-Data-Engineer/blob/master/Instructions/Labs/LAB_04_data_warehouse_using_apache_spark.md
--
SELECT
    TOP 100 *
FROM
    OPENROWSET(
        BULK 'https://vksa042772.dfs.core.windows.net/raw042772/wwi-02/sale-poc/sale-20170501.csv',
        FORMAT = 'CSV',
        PARSER_VERSION = '2.0',
        FIRSTROW = 2
    )
    WITH (
         [TransactionId] varchar(50),
        [CustomerId] int,
        [ProductId] int,
        [Quantity] int,
        [Price] decimal(10,3),
        [TotalAmount] decimal(10,3),
        [TransactionDate] varchar(8),
        [ProfitAmount] decimal(10,3),
        [Hour] int,
        [Minute] int,
        [StoreId] int
    ) 
    AS [result]

--- SPARK Pieces
