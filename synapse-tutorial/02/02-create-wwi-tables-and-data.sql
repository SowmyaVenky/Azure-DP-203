CREATE TABLE [wwi].[dimension_City]
WITH
(
    DISTRIBUTION = REPLICATE,
    CLUSTERED COLUMNSTORE INDEX
)
AS
SELECT * FROM [ext].[dimension_City]
OPTION (LABEL = 'CTAS : Load [wwi].[dimension_City]')
;

CREATE TABLE [wwi].[dimension_Customer]
WITH
(
    DISTRIBUTION = REPLICATE,
    CLUSTERED COLUMNSTORE INDEX
)
AS
SELECT * FROM [ext].[dimension_Customer]
OPTION (LABEL = 'CTAS : Load [wwi].[dimension_Customer]')
;

CREATE TABLE [wwi].[dimension_Employee]
WITH
(
    DISTRIBUTION = REPLICATE,
    CLUSTERED COLUMNSTORE INDEX
)
AS
SELECT * FROM [ext].[dimension_Employee]
OPTION (LABEL = 'CTAS : Load [wwi].[dimension_Employee]')
;

CREATE TABLE [wwi].[dimension_PaymentMethod]
WITH
(
    DISTRIBUTION = REPLICATE,
    CLUSTERED COLUMNSTORE INDEX
)
AS
SELECT * FROM [ext].[dimension_PaymentMethod]
OPTION (LABEL = 'CTAS : Load [wwi].[dimension_PaymentMethod]')
;

CREATE TABLE [wwi].[dimension_StockItem]
WITH
(
    DISTRIBUTION = REPLICATE,
    CLUSTERED COLUMNSTORE INDEX
)
AS
SELECT * FROM [ext].[dimension_StockItem]
OPTION (LABEL = 'CTAS : Load [wwi].[dimension_StockItem]')
;

CREATE TABLE [wwi].[dimension_Supplier]
WITH
(
    DISTRIBUTION = REPLICATE,
    CLUSTERED COLUMNSTORE INDEX
)
AS
SELECT * FROM [ext].[dimension_Supplier]
OPTION (LABEL = 'CTAS : Load [wwi].[dimension_Supplier]')
;

CREATE TABLE [wwi].[dimension_TransactionType]
WITH
(
    DISTRIBUTION = REPLICATE,
    CLUSTERED COLUMNSTORE INDEX
)
AS
SELECT * FROM [ext].[dimension_TransactionType]
OPTION (LABEL = 'CTAS : Load [wwi].[dimension_TransactionType]')
;

CREATE TABLE [wwi].[fact_Movement]
WITH
(
    DISTRIBUTION = HASH([Movement Key]),
    CLUSTERED COLUMNSTORE INDEX
)
AS
SELECT * FROM [ext].[fact_Movement]
OPTION (LABEL = 'CTAS : Load [wwi].[fact_Movement]')
;

CREATE TABLE [wwi].[fact_Order]
WITH
(
    DISTRIBUTION = HASH([Order Key]),
    CLUSTERED COLUMNSTORE INDEX
)
AS
SELECT * FROM [ext].[fact_Order]
OPTION (LABEL = 'CTAS : Load [wwi].[fact_Order]')
;

CREATE TABLE [wwi].[fact_Purchase]
WITH
(
    DISTRIBUTION = HASH([Purchase Key]),
    CLUSTERED COLUMNSTORE INDEX
)
AS
SELECT * FROM [ext].[fact_Purchase]
OPTION (LABEL = 'CTAS : Load [wwi].[fact_Purchase]')
;

CREATE TABLE [wwi].[seed_Sale]
WITH
(
    DISTRIBUTION = HASH([WWI Invoice ID]),
    CLUSTERED COLUMNSTORE INDEX
)
AS
SELECT * FROM [ext].[fact_Sale]
OPTION (LABEL = 'CTAS : Load [wwi].[seed_Sale]')
;

CREATE TABLE [wwi].[fact_StockHolding]
WITH
(
    DISTRIBUTION = HASH([Stock Holding Key]),
    CLUSTERED COLUMNSTORE INDEX
)
AS
SELECT * FROM [ext].[fact_StockHolding]
OPTION (LABEL = 'CTAS : Load [wwi].[fact_StockHolding]')
;

CREATE TABLE [wwi].[fact_Transaction]
WITH
(
    DISTRIBUTION = HASH([Transaction Key]),
    CLUSTERED COLUMNSTORE INDEX
)
AS
SELECT * FROM [ext].[fact_Transaction]
OPTION (LABEL = 'CTAS : Load [wwi].[fact_Transaction]')
;