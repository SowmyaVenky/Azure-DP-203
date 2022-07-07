.create table movies (
    movie_id: int, 
    is_adult: string, 
    budget: real, 
    original_language: string, 
    title: string, 
    popularity: real,
    release_date: datetime,
    revenue: long,
    vote_count: int,
    vote_average: real
)


.clear table movies data 
.ingest into table movies 'https://vksa042772.blob.core.windows.net/raw042772/wwi-02/movielens/movies/part-00000-44fcd5b7-7bd7-4adc-ad77-875aae382253-c000.snappy.parquet' 
 with
(
    format="parquet"
)

.create table movie_collection (
    movie_id: int, 
    collection_id: int
)

.clear table movie_collection data 
.ingest into table movie_collection 'https://vksa042772.blob.core.windows.net/raw042772/wwi-02/movielens/movie_collection/part-00000-6c88f68a-1ebb-4072-ae98-3e17b47d27ce-c000.snappy.parquet' 
 with
(
    format="parquet"
)


.create table collections (
    collection_id: int,
    collection_name: string,
    collection_poster_path: string,
    collection_backdrop_path: string
)

.clear table collections data 
.ingest into table collections 'https://vksa042772.blob.core.windows.net/raw042772/wwi-02/movielens/collections/part-00000-cabbba28-7ebc-41f4-bf56-cc1057e2e264-c000.snappy.parquet' 
 with
(
    format="parquet"
)

movies | count
movie_collection | count
collections | count


movies
| sort by release_date
| project  ['title'], release_date

movies
| top 5 by revenue desc
| project  movie_id, ['title'], release_date, revenue

movies
| summarize movie_count = count() by is_adult
| render  barchart 



movies
| join (
    movie_collection 
) on movie_id  
| join (
    collections
) on collection_id
| summarize movie_count = count() by original_language
| render  barchart 