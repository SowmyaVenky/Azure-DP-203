from pyspark.sql.types import *
import datetime
from pyspark import SparkContext, SparkConf
from pyspark.sql import SQLContext
from pyspark.sql.functions import monotonically_increasing_id

conf = SparkConf()
conf.setMaster("local")
conf.setAppName("IPL Analysis")

sc = SparkContext(conf = conf)
sqlContext = SQLContext(sc)

print(sqlContext)
print(sc)

matchesdf = sqlContext.read.option("header","true").csv("/home/venkyuser/ipl/IPL Matches 2008-2020.csv")
print("Matches count: " + str(matchesdf.count()))

matchesdf.printSchema()

team1df = matchesdf.select("team1").dropDuplicates()
team2df = matchesdf.select("team2").dropDuplicates()

teamsdf = team1df.union(team2df).dropDuplicates().withColumnRenamed("team1", "team").withColumn("id", monotonically_increasing_id())
teamsdf.show()

print("Writing teams dim data")

teamsdf.repartition(1).write.option("header","true").mode("overwrite").csv("/home/venkyuser/ipl/teams.csv")
                                                                                                                           