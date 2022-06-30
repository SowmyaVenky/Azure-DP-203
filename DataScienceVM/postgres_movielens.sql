BEGIN;

CREATE SCHEMA IF NOT EXISTS movies;

CREATE TABLE IF NOT EXISTS movies.ratings (
    user_movie_id INT GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER NOT NULL,
    movie_id INTEGER NOT NULL,
    rating NUMERIC,
    primary key (user_movie_id)
);

DROP TABLE movies.movies;
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

CREATE TABLE IF NOT EXISTS movies.movie_genre (
    movie_id INT NOT NULL,
    genre_id INT NOT NULL,
    primary key (movie_id, genre_id)
);

CREATE TABLE IF NOT EXISTS movies.genre (
    genre_id INT NOT NULL,
    genre_name VARCHAR(300),
    primary key (genre_id)
);

CREATE TABLE IF NOT EXISTS movies.date (
    release_date DATE NOT NULL,
    day INT,
    week INT,
    month INT,
    quarter INT,
    year INT,
    primary key (release_date)
);

CREATE TABLE IF NOT EXISTS movies.cpi (
    date_cd DATE NOT NULL,
    consumer_price_index FLOAT
);

END;