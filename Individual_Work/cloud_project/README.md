# Spark Submission Scripts:
 - submit_workload_1.sh : runs workload with 3 executors using cluster mode on EMR.
 - submit_workload_2.sh : runs workload with 3 executors using cluster mode on EMR.

# Python Scripts:
 - Workload_1.py
 - Workload_2.py

# Jupyter Notebook Files:
 - Workload_1.ipynb
 - Workload_2.ipynb

# Workload 1 HDFS Output files:
 - workload_1_tfidf.csv
 - workload_1_w2v.csv

# Workload 2 HDFS Output files:
 - workload_2.csv

### Execution ###
Run workload X by running command ./submit_workload_X.sh (no further arguments needed).
Ensure python scripts are in the same directory, and tweets data is on HDFS.
Output results of workloads can be accessed from the HDFS Output files.
