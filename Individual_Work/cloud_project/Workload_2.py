#!/usr/bin/env python
# coding: utf-8

# # <center>Workload 2

# ### <center>Recommend top 5 mention users to each tweet user in the data set

# Key points about problem:
# * The degree to which a mention user should be recommended to a given tweet user will depend on the number of times they appear in the tweet.
# * A collaboriative filtering ML algorithm (called ALS) will need to be trained and applied on all the data
# * User: tweet users
# * Item: mention users
# * Rating: number of times the tweet user mentions the mention user
# * The ALS algorithm has a function to display top N recommendations for each user

# In[1]:


from pyspark.sql import SparkSession
from pyspark.ml.recommendation import ALS
from pyspark.ml.feature import StringIndexer
from pyspark.sql.types import IntegerType
from operator import add
import numpy as np


# In[2]:


spark = SparkSession     .builder     .appName("Workload 2 - top 5 recommendations")     .getOrCreate()

path = "./tweets.json"
tweets = spark.read.json(path, multiLine=True)

# Drop unecessary columns
tweets = tweets.drop("created_at")
tweets = tweets.drop("hash_tags")
tweets = tweets.drop("text")
tweets = tweets.drop("replyto_user_id")
tweets = tweets.drop("retweet_user_id")
tweets = tweets.drop("replyto_id")
tweets = tweets.drop("retweet_id")
tweets = tweets.drop("id")


# ### 1.0 Pre-Processing

# In[3]:


# Filter out null user mentions
tweets = tweets.filter("user_mentions is not null")

# Create new records ("user_id mention_user_id", rating) for each user mentioned in a tweet
def unroll_user_mentions(rec):
    return [( str(rec[0]) + " " + str(user_mention[0]), len(user_mention[1])) for user_mention in rec[1]]

tweets_rdd = tweets.rdd.flatMap(unroll_user_mentions)

# Multiple tweets may have the same user_id and mention_user_id.
# So sum the rating values across these tweets.
tweets_rdd = tweets_rdd.reduceByKey(add)

# Separate the user_id and mention_user_id from the same string.
# Create new records (user_id, mention_user_id, rating)
tweets_rdd = tweets_rdd.map(lambda rec: (rec[0].split(" ")[0],rec[0].split(" ")[1],rec[1]))

schema = ["user_id", "mention_user", "rating"]
newTweets = spark.createDataFrame(tweets_rdd, schema)
#newTweets.filter("rating > 2").show(10)


# ### 2.0 Label Encoding

# In[4]:


# Credit: Stack overflow on how to do label encoding for categorical values
# https://stackoverflow.com/questions/30580410/how-to-do-labelencoding-or-categorical-value-in-apache-spark/31027848
user_indexer = StringIndexer(inputCol="user_id", outputCol="user_id_index")
mention_indexer = StringIndexer(inputCol="mention_user", outputCol="mention_user_index")

newTweets = user_indexer.fit(newTweets).transform(newTweets)
newTweets = mention_indexer.fit(newTweets).transform(newTweets)
newTweets = newTweets.cache()


# ### 3.0 Collaborative Filtering

# In[5]:


# Train the ALS collaborative filtering algorithm
als = ALS(maxIter=5, regParam=0.01, userCol="user_id_index", itemCol="mention_user_index", ratingCol="rating",
          coldStartStrategy="drop")
model = als.fit(newTweets)

# Recommend the top 5 mention users for each tweet user
userRecs = model.recommendForAllUsers(5)


# ### 4.0 Post-Processing and Display

# In[6]:


# Display top 5 mention users for each tweet user
#
# Step 1: Unroll top 5 encoded mention users.
def unroll_recommendations(record):
    return [(record[0], recommendation["mention_user_index"], recommendation["rating"]) for recommendation in record[1]]
userRecs = userRecs.rdd.flatMap(unroll_recommendations)
userRecs = spark.createDataFrame(userRecs,["user_id_index", "mention_user_index", "rating"])

# Step 2: Unencode user_ids and mention_user_ids by joining with cached tweets table
newTweets_no_user = newTweets.drop('rating', "user_id_index", "user_id").drop_duplicates(subset=['mention_user'])
userRecs = userRecs.join(newTweets_no_user, on="mention_user_index").drop("mention_user_index")

newTweets_no_mention = newTweets.drop('mention_user', 'rating', 'mention_user_index').drop_duplicates(subset=['user_id'])
userRecs = userRecs.join(newTweets_no_mention, on="user_id_index").drop("user_id_index", "rating")

# Step 3: Group mention users and ratings by by user_id
userRecs_rdd = userRecs.rdd.map(lambda rec: (rec[1], rec[0]))
userRecs_rdd = userRecs_rdd.groupByKey()

# Step 4: Format grouped mention users into individual columns
def unroll_top_5(values):
    top5 = []    
    for v in values:
            top5.append(v)
    return top5
userRecs_rdd = userRecs_rdd.mapValues(unroll_top_5)
userRecs_rdd = userRecs_rdd.map(lambda rec: (rec[0], rec[1][0], rec[1][1], rec[1][2], rec[1][3], rec[1][4]))

# Step 5: Display
userRecs = spark.createDataFrame(userRecs_rdd, ["user_id", "Recommendation 1", "Recommendation 2", "Recommendation 3", "Recommendation 4", "Recommendation 5" ])
userRecs.write.csv("workload_2.csv")


# In[7]:


spark.stop()

