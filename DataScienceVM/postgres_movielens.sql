BEGIN;

DROP SCHEMA IF EXISTS movies;
CREATE SCHEMA IF NOT EXISTS movies;

DROP TABLE IF EXISTS movies.ratings;
CREATE TABLE IF NOT EXISTS movies.ratings (
    user_movie_id INT GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER NOT NULL,
    movie_id INTEGER NOT NULL,
    rating NUMERIC,
    primary key (user_movie_id)
);

DROP TABLE IF EXISTS movies.movies;
CREATE TABLE IF NOT EXISTS movies.movies (
    movie_id INT NOT NULL,
    is_adult VARCHAR(5) NOT NULL,
    budget BIGINT NOT NULL,
    original_language CHAR(2) NOT NULL,
    title VARCHAR(300) NOT NULL,
    popularity FLOAT,
    release_date VARCHAR(10),
    revenue BIGINT NOT NULL,
    vote_count INT,
    vote_average FLOAT,
    primary key (movie_id)
);

DROP TABLE IF EXISTS movies.movie_genre;
CREATE TABLE IF NOT EXISTS movies.movie_genre (
    movie_id INT NOT NULL,
    genre_id INT NOT NULL,
    primary key (movie_id, genre_id)
);

DROP TABLE IF EXISTS movies.genre;
CREATE TABLE IF NOT EXISTS movies.genre (
    genre_id INT NOT NULL,
    genre_name VARCHAR(300),
    primary key (genre_id)
);

DROP TABLE IF EXISTS movies.movie_collection;
CREATE TABLE IF NOT EXISTS movies.movie_collection (
    movie_id INT NOT NULL,
    collection_id INT NOT NULL,
    primary key (movie_id, collection_id)
);

DROP TABLE IF EXISTS movies.collections;
CREATE TABLE IF NOT EXISTS movies.collections (
    collection_id INT NOT NULL,
    collection_name VARCHAR(300) NOT NULL,
    collection_poster_path VARCHAR(300),
    collection_backdrop_path VARCHAR(300),
    primary key (collection_id)
);

DROP TABLE IF EXISTS movies.movie_production_company;
CREATE TABLE IF NOT EXISTS movies.movie_production_company (
    movie_id INT NOT NULL,
    production_company_id INT NOT NULL,
    primary key (movie_id, production_company_id)
);

DROP TABLE IF EXISTS movies.production_company;
CREATE TABLE IF NOT EXISTS movies.production_company (
    production_company_id INT NOT NULL,
    production_company_name VARCHAR(300) NOT NULL,
    primary key (production_company_id)
);

DROP TABLE IF EXISTS movies.movie_production_country;
CREATE TABLE IF NOT EXISTS movies.movie_production_country (
    movie_id INT NOT NULL,
    production_country_id VARCHAR(10) NULL,
    primary key (movie_id, production_country_id)
);

DROP TABLE IF EXISTS movies.production_country;
CREATE TABLE IF NOT EXISTS movies.production_country (
    production_country_id VARCHAR(10) NOT NULL,
    production_country_name VARCHAR(300) NOT NULL,
    primary key (production_country_id)
);

DROP TABLE IF EXISTS movies.movie_spoken_language;
CREATE TABLE IF NOT EXISTS movies.movie_spoken_language (
    movie_id INT NOT NULL,
    spoken_language_id VARCHAR(10) NOT NULL,
    primary key (movie_id, spoken_language_id)
);

DROP TABLE IF EXISTS movies.spoken_language;
CREATE TABLE IF NOT EXISTS movies.spoken_language (
    spoken_language_id VARCHAR(10) NOT NULL,
    spoken_language_name VARCHAR(300) NOT NULL,
    primary key (spoken_language_id)
);

DROP TABLE IF EXISTS movies.movie_cast;
CREATE TABLE IF NOT EXISTS movies.movie_cast (
    movie_id INT NOT NULL,
    cast_id INT NOT NULL,
    character_name VARCHAR(300) NOT NULL,
    credit_id VARCHAR(30) NOT NULL,
    gender INT NOT NULL,
    movie_cast_id INT NOT NULL,
    cast_name VARCHAR(100) NOT NULL,
    cast_order INT NOT NULL,
    profile_path VARCHAR(100),
    primary key (movie_id, cast_id)
);

DROP TABLE IF EXISTS movies.movie_crew;
CREATE TABLE IF NOT EXISTS movies.movie_crew (
    movie_id INT NOT NULL,
    credit_id VARCHAR(30) NOT NULL,
    department VARCHAR(300) NOT NULL,
    gender INT NOT NULL,
    crew_id INT NOT NULL,
    crew_job VARCHAR(100),
    crew_name VARCHAR(100),
    profile_path VARCHAR(100),
    primary key (movie_id, credit_id, crew_id)
);

DROP TABLE IF EXISTS movies.date;
CREATE TABLE IF NOT EXISTS movies.date (
    release_date DATE NOT NULL,
    day INT,
    week INT,
    month INT,
    quarter INT,
    year INT,
    primary key (release_date)
);
END;

SELECT COUNT(*) 
FROM 
movies.movies;

SELECT COUNT(*) 
FROM 
movies.movie_crew;

INSERT INTO movies.date 
SELECT distinct(to_date(release_date,'YYYY-MM-DD')) as release_date,
EXTRACT(DAY from to_date(release_date,'YYYY-MM-DD')) as day,
EXTRACT(WEEK from to_date(release_date,'YYYY-MM-DD')) as week,
EXTRACT(MONTH FROM to_date(release_date,'YYYY-MM-DD')) as month,
EXTRACT(QUARTER FROM to_date(release_date,'YYYY-MM-DD')) as quarter,
EXTRACT(YEAR FROM to_date(release_date,'YYYY-MM-DD')) as year
from 
movies.movies;

select cast_name
,character_name
from 
movies.movie_cast 
join 
(
SELECT movie_id,
count(rating) as num_ratings
from movies.ratings
group by movie_id
order by num_ratings desc
limit 10
) top_rated
on movies.movie_cast.movie_id = top_rated.movie_id
;
