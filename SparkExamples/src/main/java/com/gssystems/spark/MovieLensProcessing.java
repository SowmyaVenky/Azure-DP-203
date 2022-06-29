package com.gssystems.spark;

import com.google.gson.Gson;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.function.Function2;
import org.apache.spark.api.java.function.Function3;
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

public class MovieLensProcessing {
    public static void main(String[] args) {
        String moviesFile = "C:\\Venky\\DP-203\\SowmyaVenkyRepo\\movielens\\movies_metadata.csv";
        String ratingsFile = "C:\\Venky\\DP-203\\SowmyaVenkyRepo\\movielens\\ratings.csv";
        SparkSession spark = SparkSession.builder().appName("Simple Application").getOrCreate();
        spark.sparkContext().setLogLevel("ERROR");

        Dataset moviesdf = spark.read().option("header","true").csv(moviesFile);
       
        Dataset movies_df = moviesdf.select(
            moviesdf.col("id").alias("movie_id"),
            moviesdf.col("adult").alias("is_adult"),
            moviesdf.col("budget"),
            moviesdf.col("original_language"),
            moviesdf.col("title"),
            moviesdf.col("popularity"),
            moviesdf.col("release_date"),
            moviesdf.col("revenue"),
            moviesdf.col("vote_count"),
            moviesdf.col("vote_average")
        ).na().drop();

        movies_df.printSchema();
        System.out.println(movies_df.count());
        movies_df.show();

        // Maps to apr_item_number=optimized price json
        PairFlatMapFunction<Row, Integer, String> genremapper = new PairFlatMapFunction<Row, Integer, String>() {
            private static final long serialVersionUID = 1L;

            @SuppressWarnings({ "rawtypes" })
            @Override
            public Iterator<Tuple2<Integer, String>> call(Row t) throws Exception {
                Gson gson = new Gson();
                List<Tuple2<Integer, String>> toRet = new ArrayList<Tuple2<Integer, String>>();
                //Get json array of genres.
                String genrejson = t.getString(0);
                if( genrejson != null && genrejson.trim().length() > 0  && genrejson.trim().startsWith("[")) {
                    List<Map<String, Object>> genereParsed = gson.fromJson(genrejson, List.class);
                    if( genereParsed.size() > 0 ) {
                        for(Map<String, Object> m : genereParsed) {
                            //System.out.println(m);
                            Double idval = Double.parseDouble(m.get("id").toString());
                            Tuple2<Integer, String> pair = new Tuple2<Integer, String>(
                                    idval.intValue(), m.get("name").toString());
                            toRet.add(pair);
                        }
                    }
                }
                return toRet.iterator();
            }
        };

        //Calculate genre
        JavaPairRDD<String, String> genrerdd = moviesdf.select("genres").toJavaRDD().flatMapToPair(genremapper);
        System.out.println("Genre count =" + genrerdd.count());

        //de-dup the values
        Function3<Integer, String, Integer, String> recordstorededupper = new Function3<Integer, String, Integer, String>() {
            @Override
            public String call(Integer integer, String s, Integer integer2) throws Exception {
                return null;
            }

            private static final long serialVersionUID = -3062191337438821870L;

            @SuppressWarnings({ "unchecked", "rawtypes" })
            @Override
            public String call(Integer v1, String v2) throws Exception {
                Map valsConsolidated = new TreeMap();

                // We consolidate both maps and push the de-dup list of vehicles.
                valsConsolidated.putAll(vals1);
                valsConsolidated.putAll(vals2);

                String mergedJson = gson.toJson(valsConsolidated);
                return mergedJson;
            }
        };

        Dataset ratingsdf = spark.read().option("header","true").csv(ratingsFile);
        ratingsdf = ratingsdf.select(
            ratingsdf.col("userId").alias("user_id"),
            ratingsdf.col("movieId").alias("movie_id"),
            ratingsdf.col("rating")
        );

        ratingsdf.printSchema();
        System.out.println(ratingsdf.count());
        ratingsdf.show();

        spark.stop();
    }
}
