package com.gssystems.spark;

import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.SaveMode;
import org.apache.spark.sql.SparkSession;
import org.apache.spark.sql.types.DataTypes;
import org.apache.spark.sql.types.Metadata;
import org.apache.spark.sql.types.StructField;
import org.apache.spark.sql.types.StructType;

public class CreditsExploration {
	private static final boolean WRITE_FILE_OUTPUTS = true;
	public static void main(String[] args) {
		
		if (args == null || args.length != 1) {
			System.out.println("Need to pass 1 parameters - credits.csv for this to work!");
			System.exit(-1);
		}

		String moviesFile = args[0];

		SparkSession spark = SparkSession.builder().appName("Movielens").getOrCreate();
		spark.sparkContext().setLogLevel("ERROR");

		// these options are needed as the fields are quoted.
		Dataset creditsdf = spark.read().option("quote", "\"").option("escape", "\"").option("header", "true")
				.csv(moviesFile);
		creditsdf.printSchema();
		//creditsdf.select("id").show(false);

		StructType castSchema = new StructType(
				new StructField[] { new StructField("cast_id", DataTypes.LongType, false, Metadata.empty()),
						new StructField("character", DataTypes.StringType, false, Metadata.empty()),
						new StructField("credit_id", DataTypes.StringType, false, Metadata.empty()),
						new StructField("gender", DataTypes.LongType, false, Metadata.empty()),
						new StructField("id", DataTypes.LongType, false, Metadata.empty()),
						new StructField("name", DataTypes.StringType, false, Metadata.empty()),
						new StructField("order", DataTypes.LongType, false, Metadata.empty()),
						new StructField("profile_path", DataTypes.StringType, false, Metadata.empty()) });

		Dataset castdf = creditsdf.filter("cast is not null")
				.withColumn("cast_data",
						org.apache.spark.sql.functions.explode(org.apache.spark.sql.functions
								.from_json(creditsdf.col("cast"), DataTypes.createArrayType(castSchema))))
				.drop("cast").drop("crew").withColumnRenamed("id", "movieId");

		Dataset castdf1 = castdf.select(castdf.col("movieId").as("movie_id").cast("int"),
				castdf.col("cast_data.cast_id").as("cast_id"),
				castdf.col("cast_data.character").as("character_name"),
				castdf.col("cast_data.credit_id").as("credit_id"),
				castdf.col("cast_data.gender").as("gender"),
				castdf.col("cast_data.id").as("movie_cast_id"),
				castdf.col("cast_data.name").as("cast_name"),
				castdf.col("cast_data.order").as("cast_order"),
				castdf.col("cast_data.profile_path").as("profile_path")
				);
		castdf1.show();
		castdf1.printSchema();
		System.out.println("Total number of cast rows : " + castdf.count());
		if (WRITE_FILE_OUTPUTS) {
			System.out.println("Writing cast file...");
			castdf1.repartition(1).write().mode(SaveMode.Overwrite).parquet("cast");
		}
		

		StructType crewSchema = new StructType(
				new StructField[] { 
						new StructField("credit_id", DataTypes.StringType, false, Metadata.empty()),
						new StructField("department", DataTypes.StringType, false, Metadata.empty()),
						new StructField("gender", DataTypes.LongType, false, Metadata.empty()),
						new StructField("id", DataTypes.LongType, false, Metadata.empty()),
						new StructField("job", DataTypes.StringType, false, Metadata.empty()),
						new StructField("name", DataTypes.StringType, false, Metadata.empty()),						
						new StructField("profile_path", DataTypes.StringType, false, Metadata.empty()) });

		Dataset crewdf = creditsdf.filter("crew is not null")
				.withColumn("crew_data",
						org.apache.spark.sql.functions.explode(org.apache.spark.sql.functions
								.from_json(creditsdf.col("crew"), DataTypes.createArrayType(crewSchema))))
				.drop("cast").drop("crew").withColumnRenamed("id", "movieId");
		
		Dataset crewdf1 = crewdf.select(
					crewdf.col("movieId").as("movie_id").cast("int"),
					crewdf.col("crew_data.credit_id").as("credit_id"),
					crewdf.col("crew_data.department").as("department"),
					crewdf.col("crew_data.gender").as("gender"),
					crewdf.col("crew_data.id").as("crew_id"),
					crewdf.col("crew_data.job").as("crew_job"),
					crewdf.col("crew_data.name").as("crew_name"),
					crewdf.col("crew_data.profile_path").as("profile_path")
				);
		crewdf1.show(false);
		crewdf1.printSchema();
		System.out.println("Total number of crew rows : " + crewdf1.count());
		if (WRITE_FILE_OUTPUTS) {
			System.out.println("Writing cast file...");
			crewdf1.repartition(1).write().mode(SaveMode.Overwrite).parquet("crew");
		}

		spark.close();
	}

}
