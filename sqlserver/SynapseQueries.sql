## 
##
# First we run the pipeline, and that will create the data in parquet format.
# That is what is getting queried.
###

SELECT
    TOP 100 *
FROM
    OPENROWSET(
        BULK 'https://venkydatalake101.blob.core.windows.net/rawzone/orders/',
        FORMAT='PARQUET'
    ) AS [result]

##
# This one is a schema on read example
##
SELECT
    TOP 100 *
FROM
    OPENROWSET(
        BULK 'https://venkydatalake101.blob.core.windows.net/stagingzone/orders/',
        FORMAT='CSV',
        PARSER_VERSION='2.0',
        FIRSTROW = 2
    )  WITH (
        ORDER_ID int 1,
        CUSTOMER_ID int 2
    )
    AS [result]