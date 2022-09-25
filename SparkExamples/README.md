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

spark-submit --master local[4] --class com.gssystems.spark.CreditsExploration target\SparkExamples-1.0-SNAPSHOT.jar file:///C:/Venky/DP-203/SowmyaVenkyRepo/movielens/credits.csv

spark-submit --master local[4] --class com.gssystems.spark.KeywordsExploration target\SparkExamples-1.0-SNAPSHOT.jar file:///C:/Venky/DP-203/SowmyaVenkyRepo/movielens/keywords.csv

##ML data prep
spark-submit --master local[4] --class com.gssystems.spark.MLDataPrepProcess target\SparkExamples-1.0-SNAPSHOT.jar file:///C:/Venky/DP-203/Azure-DP-203/wwi-02/movielens/

Cognitive search data prep
spark-submit --master local[4] --class com.gssystems.spark.MovieDataCognitiveSearchPrep target\SparkExamples-1.0-SNAPSHOT.jar file:///C:/Venky/DP-203/Azure-DP-203/wwi-02/movielens/

docker run --name venky-postgres -e POSTGRES_PASSWORD=Ganesh20022002 -p 5432:5432 -d postgres

spark-submit --master local[4] --class com.gssystems.spark.LoadMoviesIntoPostgres --jars postgresql-42.2.6.jar --driver-class-path postgresql-42.2.6.jar target\SparkExamples-1.0-SNAPSHOT.jar

spark-submit --packages org.apache.spark:spark-avro_2.12:3.3.0 --master local[4] --class com.gssystems.spark.AvroInsideSynapse target\SparkExamples-1.0-SNAPSHOT.jar C:/Venky/DP-203/Azure-DP-203/wwi-02/avro/twitterdata C:/Venky/DP-203/Azure-DP-203/wwi-02/avro/twitteravro/ C:/Venky/DP-203/Azure-DP-203/wwi-02/avro/twitterparquet/

Synapse upload file and submit spark job
Get-AzSynapseSparkJob -WorkspaceName venkysynapseworkspace101 -SparkPoolName venkysparkpool

Synapse wants a jar with JDK 1.8 

set JAVA_HOME=C:\Venky\jdk-8.0.342.07-hotspot
set PATH=%PATH%;c:\Venky\spark\bin;c:\Venky\apache-maven-3.8.4\bin
set SPARK_HOME=c:\Venky\spark
SET HADOOP_HOME=C:\Venky\DP-203\Azure-DP-203\SparkExamples


Submit-AzSynapseSparkJob -WorkspaceName venkysynapseworkspace101 -SparkPoolName venkysparkpool -Language Spark -Name TwitterDataPrep -MainDefinitionFile abfss://files@venkydatalake101.dfs.core.windows.net/jobjar/SparkExamples-1.0-SNAPSHOT.jar -MainClassName com.gssystems.spark.AvroInsideSynapse -CommandLineArgument abfss://files@venkydatalake101.dfs.core.windows.net/twitterdata,abfss://files@venkydatalake101.dfs.core.windows.net/twitterdataavro,abfss://files@venkydatalake101.dfs.core.windows.net/twitterdataparquet -ExecutorCount 2 -ExecutorSize Small
                          

docker run -d --name venky-notebook -p10000:8888 jupyter/all-spark-notebook
docker logs venky-notebook
Get the token that we have from the URL printed in the logs 
then go to http://localhost:10000/lab?token=XXXX

docker cp C:\Venky\DP-203\Azure-DP-203\wwi-02\movielens venky-notebook:/home/jovyan/movielens_processed/


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