until mongo --host ca-mongo --eval "print(\"waited for connection\")"
do
    sleep 2
done

mongo --host ca-mongo camic /config/mongo_idx.js
mongo --host ca-mongo camic-pri /config/mongo_idx_pri.js
echo "indexes created"
mongo --host ca-mongo camic /config/add_mongo_users.js
echo "users created"
mongo --host ca-mongo camic /config/default_data.js
echo "defaults added"
