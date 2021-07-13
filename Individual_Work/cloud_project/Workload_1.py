#!/usr/bin/env python
# coding: utf-8

# # <center>Workload 1

# ### <center>Find the top 5 users with similar interest as a given user id.  

# Key points about the problem:
# * The given user id can be an arbitrary user id (in this case chosen to be = 2955789098).
# * Users with 'simialr interests' likely reply/retweet to the same kind of tweets.
# * User interests can be represented as a vector (t1, t2, t2, ..., tn) of IDs of tweets that they reply/retweet to.
# * Note: if the user replies and retweets to the same tweet, it appears twice in the vector.
# * Use TF-IDF and Word2Vec to extract the features of the user vectors.
# * Use cosine similarity to compare all transformed vectors to the given users transformed vector.

# In[1]:


from pyspark.sql import SparkSession
from pyspark.ml import Pipeline
from pyspark.ml.linalg import Vectors
from pyspark.ml.feature import Word2Vec
from pyspark.ml.feature import HashingTF, IDF, Tokenizer
import math


# In[2]:


spark = SparkSession     .builder     .appName("Workload 1 - top 5 similar interests")     .getOrCreate()

path = "./tweets.json"
tweets = spark.read.json(path, multiLine=True)

# Drop unecessary columns
tweets = tweets.drop("created_at")
tweets = tweets.drop("hash_tags")
tweets = tweets.drop("text")
tweets = tweets.drop("user_mentions")
tweets = tweets.drop("replyto_user_id")
tweets = tweets.drop("retweet_user_id")
tweets = tweets.drop("id")


# ### 1.0 Creating Document Representation

# In[3]:


# Create document representation tabel

def seqFunc(accumulatedDocRep, currentUser):
    
    replyto_id, retweet_id = currentUser
    
    if (replyto_id != None):
        accumulatedDocRep += str(replyto_id) + " "
    if (retweet_id != None):
        accumulatedDocRep += str(retweet_id) + " "
            
    return accumulatedDocRep

def combFunc(accumulatedDocRep1, accumulatedDocRep2):

    combinedDocRep = accumulatedDocRep1 + accumulatedDocRep2
    return combinedDocRep

tweets_rdd = tweets.rdd.map(lambda rec: (rec[2], (rec[0], rec[1])) ) # (uid, (replyid, retweetid))
tweets_rdd = tweets_rdd.aggregateByKey("", seqFunc, combFunc, numPartitions=10)

# Filter out users that have null replyto_id and retweet_id
tweets_rdd = tweets_rdd.filter(lambda rec: len(rec[1])>0)

# Convert back to table to perform ML
schema = ["UID", "Doc_Rep"]
newTweets = spark.createDataFrame(tweets_rdd, schema)
#newTweets.show(10)


# ### 2.0 Feature extraction with TF-IDF

# In[4]:


# Perform TF-IDF transformation on document representations
tokenizer = Tokenizer(inputCol="Doc_Rep", outputCol="tokens")
hashingTF = HashingTF(inputCol="tokens", outputCol="tf_transform", numFeatures=300)
idf = IDF(inputCol="tf_transform", outputCol="tf_idf_transform")


tokensData = tokenizer.transform(newTweets)
featurizedData = hashingTF.transform(tokensData)

idfModel = idf.fit(featurizedData)
featurized_Tweets = idfModel.transform(featurizedData).drop("tf_transform")
#featurized_Tweets.show(10)


# ### 3.0 Feature extraction with Word2Vec

# In[5]:


# Perform Word2Vec feature extraction
word2Vec = Word2Vec(vectorSize=100, minCount=0, inputCol="tokens", outputCol="w2v_transform")
model = word2Vec.fit(featurized_Tweets)
featurized_Tweets = model.transform(featurized_Tweets).drop("tokens")
#featurized_Tweets.show(10)


# In[6]:


# User to compare against
#print("Similar to user id: ", 2955789098)
tf_idf_v = featurized_Tweets.select("UID", "tf_idf_transform").filter("UID == 2955789098").collect()[0][1]
#print("TF_IDF: ", tf_idf_v)
w2v_v = featurized_Tweets.select("UID", "w2v_transform").filter("UID == 2955789098").collect()[0][1]
#print("Word2Vector: ", w2v_v)


# ### 4.0 Get top 5 similar users with TF-IDF and Word2Vec

# In[7]:


# Calculating top 5 similar users for tf_idf feature extraction
schema = ["top_5_UID", "Doc_Rep", "tf_idf_transform", "w2v_transform", "similarity_tf_idf", "similarity_w2v"]

def cosine_similarity(rec):
    
    vec1 = rec["tf_idf_transform"]
    vec2 = tf_idf_v
    
    dot_prod = vec1.dot(vec2)
    l1 = vec1.dot(vec1)
    l2 = vec2.dot(vec2)
    
    similarity_tf_df = float(dot_prod/(math.sqrt(l1)*math.sqrt(l2)))
    
    vec1 = rec["w2v_transform"]
    vec2 = w2v_v
        
    dot_prod = vec1.dot(vec2)
    l1 = vec1.dot(vec1)
    l2 = vec2.dot(vec2)
    
    similarity_w2v = float(dot_prod/(math.sqrt(l1)*math.sqrt(l2)))
    
    if (rec[0] != 2955789098):    
        return [rec[0], rec[1], rec[2], rec[3], similarity_tf_df, similarity_w2v] 
    else:
        return [rec[0], rec[1], rec[2], rec[3], float(-1.0), float(-1.0)]

featurized_Tweets_rdd = featurized_Tweets.rdd.map(cosine_similarity)
featurized_Tweets_similarity = spark.createDataFrame(featurized_Tweets_rdd, schema).cache()

featurized_Tweets_similarity.sort(featurized_Tweets_similarity.similarity_tf_idf.desc()).select("top_5_UID", "similarity_tf_idf").limit(5).write.csv("workload_1_tfidf.csv")
featurized_Tweets_similarity.sort(featurized_Tweets_similarity.similarity_w2v.desc()).select("top_5_UID", "similarity_w2v").limit(5).write.csv("workload_1_w2v.csv")

# In[8]:


spark.stop()

