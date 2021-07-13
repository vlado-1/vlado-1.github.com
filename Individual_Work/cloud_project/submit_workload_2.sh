spark-submit \
    --master yarn \
    --deploy-mode cluster \
    --num-executors 3 \
    Workload_2.py \
    --output $2
