until mongo --host ca-mongo --eval "print(\"waited for connection\")"
do
    sleep 1
done

mongo --host ca-mongo camic /config/mongo_idx.js
echo "indexes created"
