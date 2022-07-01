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

public class MovieLensExploration {
	public static void main(String[] args) {
		if (args == null || args.length != 2) {
			System.out.println("Need to pass 2 parameters - movies_metadata.csv and ratings.csv for this to work!");
			System.exit(-1);
		}

		String moviesFile = args[0];
		String ratingsFile = args[1];
		SparkSession spark = SparkSession.builder().appName("Movielens").getOrCreate();
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

		Dataset moviesdf = spark.read().option("header", "true").schema(moviesSchema).csv(moviesFile);
		moviesdf.printSchema();

		Dataset collectionsdf = moviesdf.select("id", "belongs_to_collection")
				.filter(moviesdf.col("belongs_to_collection").isNotNull());

		// Extract the data from the JSON.
		Dataset collectionsdf1 = collectionsdf.withColumn("belongs_to_collection_map",
				org.apache.spark.sql.functions.from_json(collectionsdf.col("belongs_to_collection"),
						DataTypes.createMapType(DataTypes.StringType, DataTypes.StringType)));

		Dataset collectionsdf2 = collectionsdf1.drop("belongs_to_collection")
				.select(collectionsdf1.col("id").as("movie_id"),
						collectionsdf1.col("belongs_to_collection_map.id").as("collection_id"),
						collectionsdf1.col("belongs_to_collection_map.name").as("collection_name"),
						collectionsdf1.col("belongs_to_collection_map.poster_path").as("collection_poster_path"),
						collectionsdf1.col("belongs_to_collection_map.backdrop_path").as("collection_backdrop_path"))
				.filter("collection_id is not null");

		// Create two data-frames to match what we want to put in the database/synapse.
		// movie_id -> collection_id
		// collection_id with its attributes.

		Dataset movie_collection_df = collectionsdf2.select("movie_id", "collection_id");
		movie_collection_df.show(false);
		System.out.println("Movies with collections count : " + movie_collection_df.count());

		Dataset collections_table_df = collectionsdf2.drop("movie_id").dropDuplicates();
		collections_table_df.show(false);
		System.out.println("Unique collections count : " + collections_table_df.count());

		// get production companies
		System.out.println("Analyzing production_companies");
		Dataset production_companies_df = moviesdf.select("id", "production_companies").withColumnRenamed("id",
				"movie_id");

		Dataset production_companies_df1 = production_companies_df.filter("production_companies is not null")
				.withColumn("companies_json",
						org.apache.spark.sql.functions.explode(org.apache.spark.sql.functions.from_json(
								production_companies_df.col("production_companies"), DataTypes.createArrayType(
										DataTypes.createMapType(DataTypes.StringType, DataTypes.StringType)))));

		Dataset production_companies_df2 = production_companies_df1.drop("production_companies")
				.filter("companies_json is not null").select(production_companies_df1.col("movie_id"),
						production_companies_df1.col("companies_json.name").as("production_company_name"),
						production_companies_df1.col("companies_json.id").as("production_company_id"));

		//Create two datasets to push to db/synapse.
		Dataset movie_production_company = production_companies_df2.select("movie_id","production_company_id");
		movie_production_company.show(false);
		System.out.println("Movies with production company count: " + movie_production_company.count());

		Dataset production_company = production_companies_df2.select("production_company_id", "production_company_name").dropDuplicates();
		production_company.show(false);
		System.out.println("Production company count: " + production_company.count());
		
		// get production countries
		System.out.println("Analyzing production_countries");
		Dataset production_countries_df = moviesdf.select("id", "production_countries").withColumnRenamed("id",
				"movie_id");

		Dataset production_countries_df1 = production_countries_df.filter("production_countries is not null")
				.withColumn("countries_json",
						org.apache.spark.sql.functions.explode(org.apache.spark.sql.functions.from_json(
								production_countries_df.col("production_countries"), DataTypes.createArrayType(
										DataTypes.createMapType(DataTypes.StringType, DataTypes.StringType)))));
		
		Dataset production_countries_df2 = production_countries_df1.drop("production_countries")
				.filter("countries_json is not null").select(production_countries_df1.col("movie_id"),
						production_countries_df1.col("countries_json.iso_3166_1").as("production_country_id"),
						production_countries_df1.col("countries_json.name").as("production_country_name"));

		//Create two datasets to push to db/synapse.
		Dataset movie_production_country = production_countries_df2.filter("production_country_id is not null").select("movie_id","production_country_id");
		movie_production_country.show(false);
		System.out.println("Movies with production country count: " + movie_production_country.count());

		Dataset production_country = production_countries_df2.drop("movie_id").filter("production_country_id is not null").dropDuplicates();
		production_country.show(false);
		System.out.println("Production country count: " + production_country.count());

		//Languages
		System.out.println("Analyzing spoken languages");
		Dataset spoken_lang_df = moviesdf.select("id", "spoken_languages").withColumnRenamed("id",
				"movie_id");

		Dataset spoken_lang_df1 = spoken_lang_df.filter("spoken_languages is not null")
				.withColumn("spoken_languages_json",
						org.apache.spark.sql.functions.explode(org.apache.spark.sql.functions.from_json(
								spoken_lang_df.col("spoken_languages"), DataTypes.createArrayType(
										DataTypes.createMapType(DataTypes.StringType, DataTypes.StringType)))));
		
		Dataset spoken_lang_df2 = spoken_lang_df1.drop("spoken_languages")
				.filter("spoken_languages_json is not null").select(spoken_lang_df1.col("movie_id"),
						spoken_lang_df1.col("spoken_languages_json.iso_639_1").as("spoken_language_id"),
						spoken_lang_df1.col("spoken_languages_json.name").as("spoken_language_name"));
		
		spoken_lang_df2.show(false);

		//Create two datasets to push to db/synapse.
		Dataset movie_spoken_lang = spoken_lang_df2.filter("spoken_language_id is not null").select("movie_id","spoken_language_id");
		movie_spoken_lang.show(false);
		System.out.println("Movies with spoken languages count: " + movie_spoken_lang.count());

		Dataset spoken_language = spoken_lang_df2.drop("movie_id").filter("spoken_language_id is not null").dropDuplicates();
		spoken_language.show(false);
		System.out.println("Spoken Languages count: " + spoken_language.count());

		spark.stop();
	}
}
