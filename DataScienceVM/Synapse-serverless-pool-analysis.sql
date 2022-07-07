select top 10 *
from openrowset(
    bulk 'https://vksa042772.blob.core.windows.net/raw042772/wwi-02/movielens/movies/',
    format = 'parquet') as rows

-- Can create an external DS to reuse in queries
create database venky_movielens_serverless;

use venky_movielens_serverless;

create external data source movielens
with ( location = 'https://vksa042772.blob.core.windows.net/raw042772/wwi-02/movielens/' );

select top 10 *
from openrowset(
        bulk 'movies/',
        data_source = 'movielens',
        format = 'parquet'
) as rows

-- Create external tables to make life easy in queries.
CREATE EXTERNAL FILE FORMAT ParquetFormat WITH (  FORMAT_TYPE = PARQUET );

CREATE EXTERNAL TABLE Movies (
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

CREATE EXTERNAL TABLE movie_keywords (
    movie_id INT,
    keyword_id INT
)WITH (
         LOCATION = 'movie_keywords/*.parquet',
         DATA_SOURCE = movielens,
         FILE_FORMAT = ParquetFormat
);

CREATE EXTERNAL TABLE keywords (
    keyword_id INT,
    keyword VARCHAR(50)
)WITH (
         LOCATION = 'keywords/*.parquet',
         DATA_SOURCE = movielens,
         FILE_FORMAT = ParquetFormat
);

CREATE EXTERNAL TABLE ratings (
    user_id INT,
    movie_id INT,
    rating FLOAT
) WITH (
         LOCATION = 'ratings/*.parquet',
         DATA_SOURCE = movielens,
         FILE_FORMAT = ParquetFormat
);

SELECT TOP 10
* 
FROM ratings;

SELECT TOP 10
* 
from 
keywords;

SELECT
top 10 
title
from 
Movies;

select top 10
* 
from movie_keywords;

select
top 25 
B.keyword
from
movie_keywords A 
inner join 
keywords B
on A.keyword_id = B.keyword_id
left join (    
Select 
top 10
movie_id,
sum(rating) / count(user_id) as averating,
count(user_id) as ratingcount 
from
ratings
group by movie_id
order by ratingcount desc ) top_rated
on A.movie_id = top_rated.movie_id;
