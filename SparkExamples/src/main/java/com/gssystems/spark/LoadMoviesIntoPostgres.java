package com.gssystems.spark;

import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.SaveMode;
import org.apache.spark.sql.SparkSession;

public class LoadMoviesIntoPostgres {
	//For Azure database (PaaS) testing.
	//private static final String POSTGRES_JDBC_URL = "jdbc:postgresql://venkypg101.postgres.database.azure.com:5432/postgres?user=venkypg101@venkypg101&password=Ganesh20022002&sslmode=require";
	//base path where the spark shreadded out resides. on DSVM current folder.
	//private static final String BASE_PATH = "";
	//For local docker testing.
	private static final String POSTGRES_JDBC_URL = "jdbc:postgresql://localhost:5432/postgres?user=root&password=Ganesh20022002&sslmode=prefer";
	private static final String BASE_PATH = "C:/Venky/DP-203/Azure-DP-203/wwi-02/movielens/";
	
	public static void main(String[] args) {
        SparkSession spark = SparkSession.builder().appName("Movie Lens Data Load").getOrCreate();
        spark.sparkContext().setLogLevel("ERROR");
        
        if( 1 != 1) {} // Move the braces to bypass sections as needed.
        
        System.out.println("Loading table movies.movies");        
        Dataset moviesdf = spark.read().parquet(BASE_PATH + "movies");
        moviesdf.write()
          .mode(SaveMode.Overwrite)
          .format("jdbc")
          .option("driver", "org.postgresql.Driver")
          .option("url", POSTGRES_JDBC_URL)
          .option("dbtable", "movies.movies")
          .option("truncate", "true")
          .option("batchSize", "100000")
          .save();

        System.out.println("Loading table movies.genre");
        Dataset genredf = spark.read().json("genre");
        genredf.write()
          .mode(SaveMode.Overwrite)
          .format("jdbc")
          .option("driver", "org.postgresql.Driver")
          .option("url", POSTGRES_JDBC_URL)
          .option("dbtable", "movies.genre")
          .option("truncate", "true")
          .option("batchSize", "100000")
          .save();

        System.out.println("Loading table movies.movie_genre");
        Dataset moviegenredf = spark.read().json("movie_genre").filter("movie_id is not null").dropDuplicates();
        moviegenredf.write()
          .mode(SaveMode.Overwrite)
          .format("jdbc")
          .option("driver", "org.postgresql.Driver")
          .option("url", POSTGRES_JDBC_URL)
          .option("dbtable", "movies.movie_genre")
          .option("SaveMode", "OVERWRITE")
          .option("batchSize", "100000")
          .option("truncate", "true")
          .save();
        
        
        System.out.println("Loading table movies.movie_collection");
        Dataset movie_collection = spark.read().parquet(BASE_PATH + "movie_collection").filter("movie_id is not null").dropDuplicates();
        movie_collection.write()
          .mode(SaveMode.Overwrite)
          .format("jdbc")
          .option("driver", "org.postgresql.Driver")
          .option("url", POSTGRES_JDBC_URL)
          .option("dbtable", "movies.movie_collection")
          .option("SaveMode", "OVERWRITE")
          .option("batchSize", "100000")
          .option("truncate", "true")
          .save();

        System.out.println("Loading table movies.collections");
        Dataset collections = spark.read().parquet(BASE_PATH + "collections").filter("collection_id is not null").dropDuplicates();
        collections.write()
          .mode(SaveMode.Overwrite)
          .format("jdbc")
          .option("driver", "org.postgresql.Driver")
          .option("url", POSTGRES_JDBC_URL)
          .option("dbtable", "movies.collections")
          .option("SaveMode", "OVERWRITE")
          .option("batchSize", "100000")
          .option("truncate", "true")
          .save();

        System.out.println("Loading table movies.movie_production_company");
        Dataset movie_production_company = spark.read().parquet(BASE_PATH + "movie_production_company").filter("movie_id is not null").dropDuplicates();
        movie_production_company.write()
          .mode(SaveMode.Overwrite)
          .format("jdbc")
          .option("driver", "org.postgresql.Driver")
          .option("url", POSTGRES_JDBC_URL)
          .option("dbtable", "movies.movie_production_company")
          .option("SaveMode", "OVERWRITE")
          .option("batchSize", "100000")
          .option("truncate", "true")
          .save();
        
        System.out.println("Loading table movies.production_company");
        Dataset production_company = spark.read().parquet(BASE_PATH + "production_company").filter("production_company_id is not null").dropDuplicates();
        production_company.write()
          .mode(SaveMode.Overwrite)
          .format("jdbc")
          .option("driver", "org.postgresql.Driver")
          .option("url", POSTGRES_JDBC_URL)
          .option("dbtable", "movies.production_company")
          .option("SaveMode", "OVERWRITE")
          .option("batchSize", "100000")
          .option("truncate", "true")
          .save();

        System.out.println("Loading table movies.movie_production_country");
        Dataset movie_production_country = spark.read().parquet(BASE_PATH + "movie_production_country").filter("movie_id is not null").dropDuplicates();
        movie_production_country.write()
          .mode(SaveMode.Overwrite)
          .format("jdbc")
          .option("driver", "org.postgresql.Driver")
          .option("url", POSTGRES_JDBC_URL)
          .option("dbtable", "movies.movie_production_country")
          .option("SaveMode", "OVERWRITE")
          .option("batchSize", "100000")
          .option("truncate", "true")
          .save();

        
        System.out.println("Loading table movies.production_country");
        Dataset production_country = spark.read().parquet(BASE_PATH + "production_country").filter("production_country_id is not null").dropDuplicates();
        production_country.write()
          .mode(SaveMode.Overwrite)
          .format("jdbc")
          .option("driver", "org.postgresql.Driver")
          .option("url", POSTGRES_JDBC_URL)
          .option("dbtable", "movies.production_country")
          .option("SaveMode", "OVERWRITE")
          .option("batchSize", "100000")
          .option("truncate", "true")
          .save();

        System.out.println("Loading table movies.movie_spoken_language");
        Dataset movie_spoken_language = spark.read().parquet(BASE_PATH + "movie_spoken_lang").filter("movie_id is not null").dropDuplicates();
        movie_spoken_language.write()
          .mode(SaveMode.Overwrite)
          .format("jdbc")
          .option("driver", "org.postgresql.Driver")
          .option("url", POSTGRES_JDBC_URL)
          .option("dbtable", "movies.movie_spoken_language")
          .option("SaveMode", "OVERWRITE")
          .option("batchSize", "100000")
          .option("truncate", "true")
          .save();

        System.out.println("Loading table movies.spoken_language");
        Dataset spoken_language = spark.read().parquet(BASE_PATH + "spoken_language").dropDuplicates();
        spoken_language.write()
          .mode(SaveMode.Overwrite)
          .format("jdbc")
          .option("driver", "org.postgresql.Driver")
          .option("url", POSTGRES_JDBC_URL)
          .option("dbtable", "movies.spoken_language")
          .option("SaveMode", "OVERWRITE")
          .option("batchSize", "100000")
          .option("truncate", "true")
          .save();
        

        System.out.println("Loading table movies.movie_cast");
        Dataset movie_cast = spark.read().parquet(BASE_PATH + "cast").filter("movie_id is not null").dropDuplicates();
        movie_cast.write()
          .mode(SaveMode.Overwrite)
          .format("jdbc")
          .option("driver", "org.postgresql.Driver")
          .option("url", POSTGRES_JDBC_URL)
          .option("dbtable", "movies.movie_cast")
          .option("SaveMode", "OVERWRITE")
          .option("batchSize", "100000")
          .option("truncate", "true")
          .save();


        System.out.println("Loading table movies.movie_crew");
        Dataset movie_crew = spark.read().parquet(BASE_PATH + "crew").filter("movie_id is not null").dropDuplicates();
        movie_crew.write()
          .mode(SaveMode.Overwrite)
          .format("jdbc")
          .option("driver", "org.postgresql.Driver")
          .option("url", POSTGRES_JDBC_URL)
          .option("dbtable", "movies.movie_crew")
          .option("SaveMode", "OVERWRITE")
          .option("batchSize", "100000")
          .option("truncate", "true")
          .save();

        System.out.println("Loading table movies.movie_keywords");
        Dataset movie_keywords = spark.read().parquet(BASE_PATH + "movie_keywords").filter("movie_id is not null").dropDuplicates();
        movie_keywords.write()
          .mode(SaveMode.Overwrite)
          .format("jdbc")
          .option("driver", "org.postgresql.Driver")
          .option("url", POSTGRES_JDBC_URL)
          .option("dbtable", "movies.movie_keywords")
          .option("SaveMode", "OVERWRITE")
          .option("batchSize", "100000")
          .option("truncate", "true")
          .save();
        
        
        System.out.println("Loading table movies.keywords");
        Dataset keywords = spark.read().parquet(BASE_PATH + "keywords").filter("keyword_id is not null").dropDuplicates();
        keywords.write()
          .mode(SaveMode.Overwrite)
          .format("jdbc")
          .option("driver", "org.postgresql.Driver")
          .option("url", POSTGRES_JDBC_URL)
          .option("dbtable", "movies.keywords")
          .option("SaveMode", "OVERWRITE")
          .option("batchSize", "100000")
          .option("truncate", "true")
          .save();

        System.out.println("Loading table movies.ratings");
        Dataset ratingsdf = spark.read().parquet(BASE_PATH + "ratings");
        ratingsdf.write()
          .mode(SaveMode.Overwrite)
          .format("jdbc")
          .option("driver", "org.postgresql.Driver")
          .option("url", POSTGRES_JDBC_URL)
          .option("dbtable", "movies.ratings")
          .option("truncate", "true")
          .option("batchSize", "100000")
          .save();

        
        spark.close();
	}
}
