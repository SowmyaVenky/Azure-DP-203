set JAVA_HOME=c:\Venky\jdk-11.0.15.10-hotspot
set PATH=%PATH%;c:\Venky\spark\bin;c:\Venky\apache-maven-3.8.6\bin
set SPARK_HOME=c:\Venky\spark

## Computer-2
set PATH=c:\Venky\spark\bin;c:\Venky\apache-maven-3.8.4\bin;%PATH%


cd C:\Venky\DP-203\SowmyaVenkyRepo\Azure-DP-203\SparkExamples
mvn clean package

SET HADOOP_HOME=C:\Venky\DP-203\Azure-DP-203\SparkExamples

## Computer-2 
SET HADOOP_HOME=C:\Venky\DP-203\SowmyaVenkyRepo\Azure-DP-203\SparkExamples

spark-submit --master local[4] --class com.gssystems.spark.MovieLensProcessing target\SparkExamples-1.0-SNAPSHOT.jar file:///C:/Venky/DP-203/SowmyaVenkyRepo/movielens/movies_metadata.csv file:///C:/Venky/DP-203/SowmyaVenkyRepo/movielens/ratings.csv

spark-submit --master local[4] --class com.gssystems.spark.MovieLensProcessingWithSchema target\SparkExamples-1.0-SNAPSHOT.jar file:///C:/Venky/DP-203/SowmyaVenkyRepo/movielens/movies_metadata.csv file:///C:/Venky/DP-203/SowmyaVenkyRepo/movielens/ratings.csv

## On DSVM
#When connecting to the DB from the DSVM, we need to make sure we add the VNET that this VM is on to the allowed list on the postgres DB
#I also added the public IP of the VM to the list of IPs that the DB server had access to.
# I also checked allow the azure services to access this DB. 
# The default db is postgres, default schema is public 

wget https://jdbc.postgresql.org/download/postgresql-42.2.6.jar

rm -rf genre movie_genre ratings movies

spark-submit --master local[4] --class com.gssystems.spark.MovieLensProcessing SparkExamples-1.0-SNAPSHOT.jar file:///home/venkyuser/movielens/movies_metadata.csv file:///home/venkyuser/movielens/ratings.csv

spark-submit --master local[4] --class com.gssystems.spark.MovieLensProcessingWithSchema SparkExamples-1.0-SNAPSHOT.jar file:///home/venkyuser/movielens/movies_metadata.csv file:///home/venkyuser/movielens/ratings.csv

spark-submit --master local[4] --class com.gssystems.spark.LoadMoviesIntoPostgres --jars postgresql-42.2.6.jar --driver-class-path postgresql-42.2.6.jar SparkExamples-1.0-SNAPSHOT.jar