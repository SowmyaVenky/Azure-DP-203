package com.gssystems.spark;

import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.SaveMode;
import org.apache.spark.sql.SparkSession;
import org.apache.spark.sql.types.DataTypes;
import org.apache.spark.sql.types.Metadata;
import org.apache.spark.sql.types.StructField;
import org.apache.spark.sql.types.StructType;

public class KeywordsExploration {
	private static final boolean WRITE_FILE_OUTPUTS = true;

	public static void main(String[] args) {

		if (args == null || args.length != 1) {
			System.out.println("Need to pass 1 parameters - keywords.csv for this to work!");
			System.exit(-1);
		}

		String keywordsFile = args[0];

		SparkSession spark = SparkSession.builder().appName("Movielens").getOrCreate();
		spark.sparkContext().setLogLevel("ERROR");

		// these options are needed as the fields are quoted.
		Dataset keywordsdf = spark.read().option("quote", "\"").option("escape", "\"").option("header", "true")
				.csv(keywordsFile);
		keywordsdf.printSchema();

		StructType keywordschema = new StructType(
				new StructField[] { new StructField("id", DataTypes.LongType, false, Metadata.empty()),
						new StructField("name", DataTypes.StringType, false, Metadata.empty()) });

		Dataset keywords_exploded = keywordsdf.filter("keywords is not null")
				.withColumn("keywords_data",
						org.apache.spark.sql.functions.explode(org.apache.spark.sql.functions
								.from_json(keywordsdf.col("keywords"), DataTypes.createArrayType(keywordschema))))
				.drop("keywords");

		Dataset keywords_exploded1 = keywords_exploded.select(keywords_exploded.col("id").as("movie_id").cast("int"),
				keywords_exploded.col("keywords_data.id").as("keyword_id").cast("int").as("keyword_id"),
				keywords_exploded.col("keywords_data.name").as("keyword"));
		
		//Movie_id to Keyword_id 
		Dataset movie_keywords = keywords_exploded1.select("movie_id", "keyword_id").dropDuplicates();
		movie_keywords.show();
		movie_keywords.printSchema();
		System.out.println("Total number of movie_keywords rows : " + movie_keywords.count());
		
		Dataset keywords = keywords_exploded1.select("keyword_id", "keyword").dropDuplicates();
		keywords.show();
		keywords.printSchema();
		System.out.println("Total number of keywords rows : " + movie_keywords.count());
		
		if (WRITE_FILE_OUTPUTS) {
			System.out.println("Writing movie_keywords file...");
			movie_keywords.repartition(1).write().mode(SaveMode.Overwrite).parquet("movie_keywords");
			System.out.println("Writing keywords file...");
			keywords.repartition(1).write().mode(SaveMode.Overwrite).parquet("keywords");
		}

		spark.close();
	}
}
