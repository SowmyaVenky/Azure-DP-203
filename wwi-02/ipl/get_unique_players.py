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

deliveriesdf = sqlContext.read.option("header","true").csv("/home/venkyuser/ipl/IPL Ball-by-Ball 2008-2020.csv")
print("Deliveries count: " + str(deliveriesdf.count()))

deliveriesdf.printSchema()

batsmandf = deliveriesdf.select("batsman").withColumnRenamed("batsman","player").dropDuplicates()
non_strikerdf = deliveriesdf.select("non_striker").withColumnRenamed("non_striker","player").dropDuplicates()
bowlerdf = deliveriesdf.select("bowler").withColumnRenamed("bowler","player").dropDuplicates()


playersdf = batsmandf.union(non_strikerdf).union(bowlerdf).dropDuplicates().withColumn("id", monotonically_increasing_id())
playersdf.show()

print("Writing players dim data")

playersdf.repartition(1).write.option("header","true").mode("overwrite").csv("/home/venkyuser/ipl/players.csv")
                                                                                                                           