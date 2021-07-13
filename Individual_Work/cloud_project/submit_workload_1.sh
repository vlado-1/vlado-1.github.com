spark-submit \
    --master yarn \
    --deploy-mode cluster \
    --num-executors 3 \
    Workload_1.py \
    --output $2
