-- https://docs.microsoft.com/en-us/azure/synapse-analytics/sql/tutorial-logical-data-warehouse
--- NOTE HAVE TO BE IN SERVERLESS POOL FOR THIS TO WORK!!!

CREATE DATABASE Ldw
      COLLATE Latin1_General_100_BIN2_UTF8;
GO

--- SWITH THE DATABASE FROM MASTER TO the LDW database --
CREATE EXTERNAL DATA SOURCE ecdc_cases WITH (
    LOCATION = 'https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/ecdc_cases/'
);
GO
CREATE EXTERNAL FILE FORMAT ParquetFormat WITH (  FORMAT_TYPE = PARQUET );
GO
CREATE EXTERNAL FILE FORMAT CsvFormat WITH (  FORMAT_TYPE = DELIMITEDTEXT );
GO
select top 10  *
from openrowset(bulk 'latest/ecdc_cases.parquet',
                data_source = 'ecdc_cases',
                format='parquet') as a
GO
create schema ecdc_adls;
GO
create external table ecdc_adls.cases (
    date_rep                   date,
    day                        smallint,
    month                      smallint,
    year                       smallint,
    cases                      smallint,
    deaths                     smallint,
    countries_and_territories  varchar(256),
    geo_id                     varchar(60),
    country_territory_code     varchar(16),
    pop_data_2018              int,
    continent_exp              varchar(32),
    load_date                  datetime2(7),
    iso_country                varchar(16)
) with (
    data_source= ecdc_cases,
    location = 'latest/ecdc_cases.parquet',
    file_format = ParquetFormat
);
GO

SELECT * 
FROM 
ecdc_adls.cases;