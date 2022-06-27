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

cityandvenuesdf = matchesdf.select("city", "venue").dropDuplicates().withColumn("id", monotonically_increasing_id())
print("Writing venues dim data")

cityandvenuesdf.repartition(1).write.option("header","true").mode("overwrite").csv("/home/venkyuser/ipl/venues.csv")
                                                                                                                           