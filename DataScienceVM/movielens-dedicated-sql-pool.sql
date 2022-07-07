-- DROP TABLE dbo.ratings;
IF NOT EXISTS (SELECT * FROM sys.objects O JOIN sys.schemas S ON O.schema_id = S.schema_id
 WHERE O.NAME = 'ratings' AND O.TYPE = 'U' AND S.NAME = 'dbo')
CREATE TABLE  dbo.ratings (
    user_id INTEGER NOT NULL,
    movie_id INTEGER NOT NULL,
    rating FLOAT
)
WITH
(
    DISTRIBUTION = ROUND_ROBIN,
    CLUSTERED COLUMNSTORE INDEX
);

COPY INTO dbo.ratings
(user_id 1, movie_id 2, rating 3)
FROM 'https://vksa042772.blob.core.windows.net/raw042772/wwi-02/movielens/ratings/'
WITH
(
    FILE_TYPE = 'PARQUET'
    ,MAXERRORS = 0
    ,IDENTITY_INSERT = 'OFF'
)

SELECT count(*)
FROM
dbo.ratings;
---
-- This is another way to get data into the tables with CTAS (create table as select)
drop external data source movielens;
create external data source movielens
with ( location = 'https://vksa042772.blob.core.windows.net/raw042772/wwi-02/movielens/' );

CREATE EXTERNAL FILE FORMAT ParquetFormat WITH (  FORMAT_TYPE = PARQUET );

CREATE EXTERNAL TABLE Movies_Ext (
    movie_id INT,
    is_adult VARCHAR(5),
    budget BIGINT,
    original_language CHAR(2),
    title VARCHAR(300),
    popularity FLOAT,
    release_date DATE,
    revenue BIGINT,
    vote_count INT,
    vote_average FLOAT
) WITH (
         LOCATION = 'movies/*.parquet',
         DATA_SOURCE = movielens,
         FILE_FORMAT = ParquetFormat
);

--DROP TABLE dbo.movies;
IF NOT EXISTS (SELECT * FROM sys.objects O JOIN sys.schemas S ON O.schema_id = S.schema_id
 WHERE O.NAME = 'movies' AND O.TYPE = 'U' AND S.NAME = 'dbo')
CREATE TABLE  dbo.movies 
WITH
(
    DISTRIBUTION = ROUND_ROBIN,
    CLUSTERED COLUMNSTORE INDEX
)
AS
SELECT * FROM Movies_Ext;

DROP table Movies_Ext;

SELECT count(*)
FROM
dbo.movies;
---
CREATE EXTERNAL TABLE movie_keywords_ext (
    movie_id INT,
    keyword_id INT
)WITH (
         LOCATION = 'movie_keywords/*.parquet',
         DATA_SOURCE = movielens,
         FILE_FORMAT = ParquetFormat
);

IF NOT EXISTS (SELECT * FROM sys.objects O JOIN sys.schemas S ON O.schema_id = S.schema_id
 WHERE O.NAME = 'movie_keywords' AND O.TYPE = 'U' AND S.NAME = 'dbo')
CREATE TABLE  dbo.movie_keywords 
WITH
(
    DISTRIBUTION = ROUND_ROBIN,
    CLUSTERED COLUMNSTORE INDEX
)
AS
SELECT * FROM movie_keywords_ext;

DROP EXTERNAL table movie_keywords_ext;

select count(*) 
from movie_keywords;

CREATE EXTERNAL TABLE keywords_ext (
    keyword_id INT,
    keyword VARCHAR(50)
)WITH (
         LOCATION = 'keywords/*.parquet',
         DATA_SOURCE = movielens,
         FILE_FORMAT = ParquetFormat
);

IF NOT EXISTS (SELECT * FROM sys.objects O JOIN sys.schemas S ON O.schema_id = S.schema_id
 WHERE O.NAME = 'keywords' AND O.TYPE = 'U' AND S.NAME = 'dbo')
CREATE TABLE  dbo.keywords 
WITH
(
    DISTRIBUTION = ROUND_ROBIN,
    CLUSTERED COLUMNSTORE INDEX
)
AS
SELECT * FROM keywords_ext;

DROP EXTERNAL table keywords_ext;

select count(*) 
from keywords;
