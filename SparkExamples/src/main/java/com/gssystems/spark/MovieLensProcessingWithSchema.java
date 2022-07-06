package com.gssystems.spark;

import com.google.gson.Gson;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.function.FlatMapFunction;
import org.apache.spark.api.java.function.Function;
import org.apache.spark.api.java.function.Function2;
import org.apache.spark.api.java.function.PairFlatMapFunction;
import org.apache.spark.sql.Column;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
import org.apache.spark.sql.types.*;
import scala.Tuple2;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

public class MovieLensProcessingWithSchema {
	private static final boolean WRITE_FILE_OUTPUTS = true;

	public static void main(String[] args) {
		if (args == null || args.length != 2) {
			System.out.println("Need to pass 2 parameters - movies_metadata.csv and ratings.csv for this to work!");
			System.exit(-1);
		}

		String moviesFile = args[0];
		String ratingsFile = args[1];
		SparkSession spark = SparkSession.builder().appName("Movielens Data wrangling").getOrCreate();
		spark.sparkContext().setLogLevel("ERROR");

		StructType moviesSchema = new StructType(
				new StructField[] { new StructField("adult", DataTypes.StringType, false, Metadata.empty()),
						new StructField("belongs_to_collection", DataTypes.StringType, false, Metadata.empty()),
						new StructField("budget", DataTypes.LongType, false, Metadata.empty()),
						new StructField("genres", DataTypes.StringType, false, Metadata.empty()),
						new StructField("homepage", DataTypes.StringType, false, Metadata.empty()),
						new StructField("id", DataTypes.IntegerType, false, Metadata.empty()),
						new StructField("imdb_id", DataTypes.StringType, false, Metadata.empty()),
						new StructField("original_language", DataTypes.StringType, false, Metadata.empty()),
						new StructField("original_title", DataTypes.StringType, false, Metadata.empty()),
						new StructField("overview", DataTypes.StringType, false, Metadata.empty()),
						new StructField("popularity", DataTypes.DoubleType, false, Metadata.empty()),
						new StructField("poster_path", DataTypes.StringType, false, Metadata.empty()),
						new StructField("production_companies", DataTypes.StringType, false, Metadata.empty()),
						new StructField("production_countries", DataTypes.StringType, false, Metadata.empty()),
						new StructField("release_date", DataTypes.DateType, false, Metadata.empty()),
						new StructField("revenue", DataTypes.LongType, false, Metadata.empty()),
						new StructField("runtime", DataTypes.FloatType, false, Metadata.empty()),
						new StructField("spoken_languages", DataTypes.StringType, false, Metadata.empty()),
						new StructField("status", DataTypes.StringType, false, Metadata.empty()),
						new StructField("tagline", DataTypes.StringType, false, Metadata.empty()),
						new StructField("title", DataTypes.StringType, false, Metadata.empty()),
						new StructField("video", DataTypes.BooleanType, false, Metadata.empty()),
						new StructField("vote_average", DataTypes.FloatType, false, Metadata.empty()),
						new StructField("vote_count", DataTypes.IntegerType, false, Metadata.empty()) });
		
		Dataset moviesdf = spark.read().option("quote", "\"").option("escape", "\"").option("header", "true").schema(moviesSchema).csv(moviesFile);

		Dataset movies_df = moviesdf.select(moviesdf.col("id").alias("movie_id"),
				moviesdf.col("adult").alias("is_adult"), moviesdf.col("budget"), moviesdf.col("original_language"),
				moviesdf.col("title"), moviesdf.col("popularity"), moviesdf.col("release_date"),
				moviesdf.col("revenue"), moviesdf.col("vote_count"), moviesdf.col("vote_average")).dropDuplicates(new String[] {"movie_id"}).na().drop();

		movies_df.printSchema();
		movies_df.show();

		if (WRITE_FILE_OUTPUTS) {
			System.out.println(movies_df.count() + " records, Writing movies file");
			movies_df.repartition(1).write().json("movies");
		}

		// Maps genere_id = genre_name
		PairFlatMapFunction<Row, Integer, String> genremapper = new PairFlatMapFunction<Row, Integer, String>() {
			private static final long serialVersionUID = 1L;

			@SuppressWarnings({ "rawtypes" })
			@Override
			public Iterator<Tuple2<Integer, String>> call(Row t) throws Exception {
				Gson gson = new Gson();

				List<Tuple2<Integer, String>> toRet = new ArrayList<Tuple2<Integer, String>>();
				// Get json array of genres.
				String genrejson = t.getString(0);
				if (genrejson != null && genrejson.trim().length() > 0 && genrejson.trim().startsWith("[")) {
					List<Map<String, Object>> genereParsed = gson.fromJson(genrejson, List.class);
					if (genereParsed.size() > 0) {
						for (Map<String, Object> m : genereParsed) {
							// System.out.println(m);
							Double idval = Double.parseDouble(m.get("id").toString());
							String genre_name = m.get("name").toString();
							m.put("genre_id", idval.intValue());
							m.put("genre_name", genre_name);
							m.remove("id");
							m.remove("name");
							Tuple2<Integer, String> pair = new Tuple2<Integer, String>(idval.intValue(),
									gson.toJson(m));
							toRet.add(pair);
						}
					}
				}
				return toRet.iterator();
			}
		};

		// Calculate genre
		JavaPairRDD<Integer, String> genrerdd = moviesdf.select("genres").toJavaRDD().flatMapToPair(genremapper);
		System.out.println("Genre count =" + genrerdd.count());

		// Reducer to de-duplicate the genres
		Function2<String, String, String> genreReducer = new Function2<String, String, String>() {
			private static final long serialVersionUID = -6061831643810838526L;

			@Override
			public String call(String v1, String v2) throws Exception {
				// return one of them.
				// System.out.println(v1);
				return v1;
			}
		};
		JavaPairRDD<Integer, String> genreReduced = genrerdd.reduceByKey(genreReducer);
		System.out.println("genreReduced count =" + genreReduced.count());

		Function<Tuple2<Integer, String>, String> removeKeyFunction = new Function<Tuple2<Integer, String>, String>() {
			private static final long serialVersionUID = -4135265152684593116L;

			@Override
			public String call(Tuple2<Integer, String> v1) throws Exception {
				// TODO Auto-generated method stub
				return v1._2();
			}

		};

		// Remove key and just use json
		JavaRDD<String> genrekeysremoved = genreReduced.map(removeKeyFunction);
		if (WRITE_FILE_OUTPUTS) {
			System.out.println("Writing genre master file...");
			genrekeysremoved.repartition(1).saveAsTextFile("genre");
		}
	    		
		StructType ratingsSchema = new StructType(
				new StructField[] { new StructField("userId", DataTypes.IntegerType, false, Metadata.empty()),
						new StructField("movieId", DataTypes.IntegerType, false, Metadata.empty()),
						new StructField("rating", DataTypes.DoubleType, false, Metadata.empty()),
						new StructField("timestamp", DataTypes.TimestampType, false, Metadata.empty())
				});
		
		Dataset ratingsdf = spark.read().option("header", "true").schema(ratingsSchema).csv(ratingsFile);
		
		ratingsdf = ratingsdf.select(ratingsdf.col("userId").alias("user_id"),
				ratingsdf.col("movieId").alias("movie_id"), ratingsdf.col("rating"));

		ratingsdf.printSchema();
		if (WRITE_FILE_OUTPUTS) {
			System.out.println(ratingsdf.count() + " records, Writing ratings file");
			ratingsdf.write().json("ratings");
		}

		// Now map movie_id to genres and de-dup that
		// Maps movie_id = genre_id
		PairFlatMapFunction<Row, Integer, String> movie_id_to_genre_id_mapper = new PairFlatMapFunction<Row, Integer, String>() {
			private static final long serialVersionUID = 1L;

			@SuppressWarnings({ "rawtypes" })
			@Override
			public Iterator<Tuple2<Integer, String>> call(Row t) throws Exception {
				Gson gson = new Gson();
				List<Tuple2<Integer, String>> toRet = new ArrayList<Tuple2<Integer, String>>();				
				Integer movieId = t.getAs("id");				
				// Get json array of genres.
				String genrejson = t.getAs("genres");

				// System.out.println("movieId = " + movieId + ", genre = " + genrejson);
				Map<String, Object> emit = new TreeMap<String, Object>();

				if (genrejson != null && genrejson.trim().length() > 0 && genrejson.trim().startsWith("[")) {
					List<Map<String, Object>> genereParsed = gson.fromJson(genrejson, List.class);
					if (genereParsed.size() > 0) {
						for (Map<String, Object> m : genereParsed) {
							emit.clear();
							Double idval = Double.parseDouble(m.get("id").toString());
							emit.put("movie_id", movieId);
							emit.put("genre_id", idval.intValue());

							String emitJson = gson.toJson(emit);

							Tuple2<Integer, String> pair = new Tuple2<Integer, String>(movieId,
									emitJson);
							toRet.add(pair);
						}
					}
				}

				return toRet.iterator();
			}
		};

		// Calculate movie_id_genre_id
		JavaPairRDD<Integer, String> movieidtogenreidRdd = moviesdf.select("id", "genres").toJavaRDD()
				.flatMapToPair(movie_id_to_genre_id_mapper);
		System.out.println("movieidtogenreidRdd count =" + movieidtogenreidRdd.count());

		Function<Tuple2<Integer, String>, String> removeKeyFunction1 = new Function<Tuple2<Integer, String>, String>() {
			private static final long serialVersionUID = 1L;

			@Override
			public String call(Tuple2<Integer, String> v1) throws Exception {
				return v1._2();
			}

		};

		// Remove key and just use json
		JavaRDD<String> movieGenreJson = movieidtogenreidRdd.map(removeKeyFunction1);
		if (WRITE_FILE_OUTPUTS) {
			System.out.println("Writing movie_genre file...");
			movieGenreJson.repartition(1).saveAsTextFile("movie_genre");
		}
		spark.stop();
	}
}
