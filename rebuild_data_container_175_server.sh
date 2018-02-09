#!/bin/bash

docker stop quip-data
docker rm   quip-data
docker rmi  quip_data
docker volume rm quip_bindaas 


git clone -b multiple_db https://github.com/camicroscope/DataDockerContainer.git; 

docker build --no-cache -t quip_data DataDockerContainer


STORAGE_FOLDER="/home/feiqiao/quip2/"

IMAGES_DIR=$(echo $STORAGE_FOLDER/img)
DATABASE_DIR=$(echo $STORAGE_FOLDER/data)

VIEWER_PORT=80
VIEWER_PORT2=8080
IMAGELOADER_PORT=6002
FINDAPI_PORT=3000

data_host="http://quip-data:9099"
mongo_host="quip-data"
mongo_port=27017

## Run data container
data_container=$(docker run --name quip-data --net=quip_nw --restart unless-stopped -itd \
    -p 27017:27017 \
 	-v quip_bindaas:/root/bindaas \
	-v $IMAGES_DIR:/data/images \
	-v $DATABASE_DIR:/var/lib/mongodb \
	quip_data)
echo "Started data container: " $data_container
