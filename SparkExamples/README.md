set JAVA_HOME=c:\Venky\jdk-11.0.15.10-hotspot
set PATH=%PATH%;c:\Venky\spark\bin;c:\Venky\apache-maven-3.8.4\bin
set SPARK_HOME=c:\Venky\spark
SET HADOOP_HOME=C:\Venky\DP-203\Azure-DP-203\SparkExamples

cd C:\Venky\DP-203\Azure-DP-203\SparkExamples
mvn clean package

Note that there is a problem when we are using windows 10 with spark. The hadoop.dll needs to be downloaded from 
https://github.com/steveloughran/winutils/tree/master/hadoop-3.0.0/bin and put into C:\Windows\System32 folder. Then we need to have the winutils.exe in a folder and set that as HADOOP_HOME. See setting above. 

spark-submit --master local[4] --class com.gssystems.spark.MovieLensExploration target\SparkExamples-1.0-SNAPSHOT.jar file:///C:/Venky/DP-203/SowmyaVenkyRepo/movielens/movies_metadata.csv file:///C:/Venky/DP-203/SowmyaVenkyRepo/movielens/ratings.csv

spark-submit --master local[4] --class com.gssystems.spark.MovieLensProcessingWithSchema target\SparkExamples-1.0-SNAPSHOT.jar file:///C:/Venky/DP-203/SowmyaVenkyRepo/movielens/movies_metadata.csv file:///C:/Venky/DP-203/SowmyaVenkyRepo/movielens/ratings.csv

spark-submit --master local[4] --class com.gssystems.spark.CreditsExploration SparkExamples-1.0-SNAPSHOT.jar file:///C:/Venky/DP-203/SowmyaVenkyRepo/movielens/credits.csv

spark-submit --master local[4] --class com.gssystems.spark.KeywordsExploration SparkExamples-1.0-SNAPSHOT.jar file:///C:/Venky/DP-203/SowmyaVenkyRepo/movielens/keywords.csv

docker run --name venky-postgres -e POSTGRES_PASSWORD=Ganesh20022002 -p 5432:5432 -d postgres

spark-submit --master local[4] --class com.gssystems.spark.LoadMoviesIntoPostgres --jars postgresql-42.2.6.jar --driver-class-path postgresql-42.2.6.jar target\SparkExamples-1.0-SNAPSHOT.jar

## On DSVM
#When connecting to the DB from the DSVM, we need to make sure we add the VNET that this VM is on to the allowed list on the postgres DB
#I also added the public IP of the VM to the list of IPs that the DB server had access to.
# I also checked allow the azure services to access this DB. 
# The default db is postgres, default schema is public 

1. Copy the raw datasets over from local to the DSVM. Change the IP below to the right public IP
scp -r c:\Venky\DP-203\SowmyaVenkyRepo\movielens venkyuser@20.228.82.254:/home/venkyuser/
scp target\SparkExamples-1.0-SNAPSHOT.jar venkyuser@20.228.82.254:/home/venkyuser
scp -r C:\Venky\DP-203\Azure-DP-203\wwi-02\movielens venkyuser@20.228.82.254:/home/venkyuser/movielens_processed/

ssh venkyuser@20.228.82.254
wget https://jdbc.postgresql.org/download/postgresql-42.2.6.jar

rm -rf genre movie_genre ratings movies

spark-submit --master local[4] --class com.gssystems.spark.MovieLensProcessingWithSchema SparkExamples-1.0-SNAPSHOT.jar file:///home/venkyuser/movielens/movies_metadata.csv file:///home/venkyuser/movielens/ratings.csv

spark-submit --master local[4] --class com.gssystems.spark.MovieLensExploration SparkExamples-1.0-SNAPSHOT.jar file:///home/venkyuser/movielens/movies_metadata.csv file:///home/venkyuser/movielens/ratings.csv

spark-submit --master local[4] --class com.gssystems.spark.CreditsExploration SparkExamples-1.0-SNAPSHOT.jar file:///home/venkyuser/movielens/credits.csv

spark-submit --master local[4] --class com.gssystems.spark.KeywordsExploration SparkExamples-1.0-SNAPSHOT.jar file:///home/venkyuser/movielens/keywords.csv

spark-submit --master local[4] --class com.gssystems.spark.LoadMoviesIntoPostgres --jars postgresql-42.2.6.jar --driver-class-path postgresql-42.2.6.jar SparkExamples-1.0-SNAPSHOT.jar