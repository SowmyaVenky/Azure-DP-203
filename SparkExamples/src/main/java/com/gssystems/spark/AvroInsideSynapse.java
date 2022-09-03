package com.gssystems.spark;

import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;

public class AvroInsideSynapse {
	public static void main(String[] args) {
		if (args == null || args.length != 3) {
			System.out.println("Need to pass 3 parameters - twitter csv dataset, avrooutfolder and parquetoutput folder for this to work!");
			System.exit(-1);
		}

		String twitterAvroFile = args[0];
		String outputAvroDirectory = args[1];
		String outputParquetDirectory = args[2];
		
		SparkSession spark = SparkSession.builder().appName("Twitter avro example").getOrCreate();
		spark.sparkContext().setLogLevel("ERROR");
		
		
		Dataset twitterdf = spark.read().option("header","true").csv(twitterAvroFile);
		twitterdf.printSchema();
		
		twitterdf.show();
		
		System.out.println("Writing an avro file with the twitter csv to prove it out on synapse.");
		twitterdf.write().option("compression","snappy").format("avro").save(outputAvroDirectory);
		
		Dataset<Row> readBackTwitterData = spark.read().format("avro").load(outputAvroDirectory);
		readBackTwitterData.printSchema();
		System.out.println("Avro dataset contains rows : " + readBackTwitterData.count());

		System.out.println("Writing an parquet file with the twitter avro to prove it out on synapse.");
		readBackTwitterData.write().option("compression","snappy").format("parquet").save(outputParquetDirectory);
		spark.stop();
	}
}
