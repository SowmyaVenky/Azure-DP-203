package com.gssystems.spark;

import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SaveMode;
import org.apache.spark.sql.SparkSession;

public class MLDataPrepProcess {
	private static final boolean WRITE_FILE_OUTPUTS = true;

	public static void main(String[] args) {
		if (args == null || args.length != 1) {
			System.out.println("Need to pass 1 parameter - folder for the shredded movielens data for this to work!");
			System.exit(-1);
		}

		String moviesFile = args[0];

		SparkSession spark = SparkSession.builder().appName("Movielens").getOrCreate();
		spark.sparkContext().setLogLevel("ERROR");

		Dataset<Row> moviesdf = spark.read().parquet(moviesFile + "/movies");

		//Join all the genres to a movie.
		Dataset<Row> movie_genre = spark.read().json(moviesFile + "/movie_genre");

		Dataset<Row> genre = spark.read().json(moviesFile + "/genre");

		Dataset<Row> movie_genre_genre = movie_genre
				.join(genre, movie_genre.col("genre_id").equalTo(genre.col("genre_id")), "leftouter").drop("genre_id");

		Dataset<Row> movie_genre_genre1 = movie_genre_genre.filter(movie_genre_genre.col("movie_id").isNotNull())
				.groupBy("movie_id").agg(org.apache.spark.sql.functions
						.concat_ws("|", org.apache.spark.sql.functions.collect_set("genre_name")).as("genres"));
		
		Dataset<Row> movie_genre_genre2 = movie_genre_genre1.filter(movie_genre_genre1.col("movie_id").isNotNull()).withColumnRenamed("movie_id", "movie_id_1");
		
		Dataset<Row> moviesdf1 = moviesdf.join(movie_genre_genre2,
				moviesdf.col("movie_id").equalTo(movie_genre_genre2.col("movie_id_1")), "leftouter").drop("movie_id_1");
		moviesdf1.printSchema();
		//moviesdf1.show(false);

		//Join all the keywords to a movie
		Dataset<Row> movie_kw = spark.read().parquet(moviesFile + "/movie_keywords").withColumnRenamed("movie_id", "movie_id_1");

		Dataset<Row> kw = spark.read().parquet(moviesFile + "/keywords");

		Dataset<Row> movie_kw1 = movie_kw
				.join(kw, movie_kw.col("keyword_id").equalTo(kw.col("keyword_id")), "leftouter").drop("keyword_id");

		Dataset<Row> movie_kw2 = movie_kw1.filter(movie_kw1.col("movie_id_1").isNotNull())
				.groupBy("movie_id_1").agg(org.apache.spark.sql.functions
						.concat_ws("|", org.apache.spark.sql.functions.collect_set("keyword")).as("keywords"));

		Dataset<Row> moviesdf2 = moviesdf1.join(movie_kw2,
				moviesdf1.col("movie_id").equalTo(movie_kw2.col("movie_id_1")), "leftouter").drop("movie_id_1");

		moviesdf2.show();
		//Collect and attach cast.
		Dataset<Row> movie_cast = spark.read().parquet(moviesFile + "/cast")
				.withColumnRenamed("movie_id", "movie_id_1")
				.select("movie_id_1", "cast_name");
		
		Dataset<Row> movie_cast1 = movie_cast.filter(movie_cast.col("movie_id_1").isNotNull())
				.groupBy("movie_id_1").agg(org.apache.spark.sql.functions
						.concat_ws("|", org.apache.spark.sql.functions.collect_set("cast_name")).as("cast"));

		Dataset<Row> moviesdf3 = moviesdf2.join(movie_cast1,
				moviesdf2.col("movie_id").equalTo(movie_cast1.col("movie_id_1")), "leftouter").drop("movie_id_1");
		moviesdf3.printSchema();
		moviesdf3.show();
		
		System.out.println("Movies prepared count: " + moviesdf3.count());
		if (WRITE_FILE_OUTPUTS) {
			System.out.println("Writing Movies file prepared...");
			moviesdf3.repartition(1).write().mode(SaveMode.Overwrite).option("encoding", "UTF-8").parquet("movies_ml_file");
		}

		spark.stop();
	}

}
