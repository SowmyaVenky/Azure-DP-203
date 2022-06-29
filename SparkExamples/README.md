set JAVA_HOME=c:\Venky\jdk-11.0.15.10-hotspot
set PATH=%PATH%;c:\Venky\spark\bin;c:\Venky\apache-maven-3.8.6\bin
set SPARK_HOME=c:\Venky\spark

cd C:\Venky\DP-203\SowmyaVenkyRepo\Azure-DP-203\SparkExamples
mvn clean package

SET HADOOP_HOME=C:\Venky\DP-203\SowmyaVenkyRepo\Azure-DP-203\SparkExamples
spark-submit --master local[4] --class com.gssystems.spark.MovieLensProcessing target\SparkExamples-1.0-SNAPSHOT.jar

