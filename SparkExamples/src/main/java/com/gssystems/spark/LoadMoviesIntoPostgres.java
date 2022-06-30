package com.gssystems.spark;

import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.SaveMode;
import org.apache.spark.sql.SparkSession;

public class LoadMoviesIntoPostgres {
	public static void main(String[] args) {
        SparkSession spark = SparkSession.builder().appName("Movie Lens Data Load").getOrCreate();
        spark.sparkContext().setLogLevel("ERROR");
        System.out.println("Loading table movies.movies");        
        Dataset moviesdf = spark.read().json("movies");
        moviesdf.write()
          .mode(SaveMode.Overwrite)
          .format("jdbc")
          .option("driver", "org.postgresql.Driver")
          .option("url", "jdbc:postgresql://venkypg101.postgres.database.azure.com:5432/postgres?user=venkypg101@venkypg101&password=Ganesh20022002&sslmode=require")
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
          .option("url", "jdbc:postgresql://venkypg101.postgres.database.azure.com:5432/postgres?user=venkypg101@venkypg101&password=Ganesh20022002&sslmode=require")
          .option("dbtable", "movies.genre")
          .option("truncate", "true")
          .option("batchSize", "100000")
          .save();

        System.out.println("Loading table movies.movie_genre");
        Dataset moviegenredf = spark.read().json("movie_genre");
        moviegenredf.write()
          .mode(SaveMode.Overwrite)
          .format("jdbc")
          .option("driver", "org.postgresql.Driver")
          .option("url", "jdbc:postgresql://venkypg101.postgres.database.azure.com:5432/postgres?user=venkypg101@venkypg101&password=Ganesh20022002&sslmode=require")
          .option("dbtable", "movies.movie_genre")
          .option("SaveMode", "OVERWRITE")
          .option("batchSize", "100000")
          .option("truncate", "true")
          .save();
        
        System.out.println("Loading table movies.ratings");
        Dataset ratingsdf = spark.read().json("ratings");
        ratingsdf.write()
          .mode(SaveMode.Overwrite)
          .format("jdbc")
          .option("driver", "org.postgresql.Driver")
          .option("url", "jdbc:postgresql://venkypg101.postgres.database.azure.com:5432/postgres?user=venkypg101@venkypg101&password=Ganesh20022002&sslmode=require")
          .option("dbtable", "movies.ratings")
          .option("truncate", "true")
          .option("batchSize", "100000")
          .save();

        
        spark.close();
	}
}
