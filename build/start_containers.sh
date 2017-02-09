#!/bin/bash

if [ "$#" -ne 1 ]; then
	echo "./start_containers.sh <storage folder path>"
	exit 1;
fi

VIEWER_DIR=ViewerDockerContainer
if [ ! -d "$VIEWER_DIR" ]; then
	git clone https://github.com/camicroscope/ViewerDockerContainer
fi

STORAGE_FOLDER=$1

docker network create quip_nw

IMAGES_DIR=$(echo $STORAGE_FOLDER/img)
DATABASE_DIR=$(echo $STORAGE_FOLDER/data)

mkdir -p $IMAGES_DIR 
mkdir -p $DATABASE_DIR

VIEWER_PORT=80
IMAGELOADER_PORT=6002
FINDAPI_PORT=3000

data_host="http://quip-data:9099"
mongo_host="quip-data"
mongo_port=27017

# Run data container
data_container=$(docker run --name quip-data --net=quip_nw -itd \
	-v $IMAGES_DIR:/data/images -v $DATABASE_DIR:/data/db \
	quip_data)
echo "Started data container: " $data_container

# Run loader container
loader_container=$(docker run --name quip-loader --net=quip_nw -itd \
	-p $IMAGELOADER_PORT:3002 -v $IMAGES_DIR:/data/images \
	-e "mongo_host=$(echo $mongo_host)" -e "mongo_port=$(echo $mongo_port)" \
	-e "dataloader_host=$(echo $data_host)" -e "annotations_host=$(echo $data_host)" \
	quip_loader)
echo "Started loader container: " $loader_container

# Run viewer container
INP_HTML_DIRECTORY=$(pwd)"/ViewerDockerContainer/html"
\cp -rf $INP_HTML_DIRECTORY $STORAGE_FOLDER/.
HTML_DIRECTORY="$STORAGE_FOLDER/html"
## \cp -f configs/config_DS.php $HTML_DIRECTORY/camicroscope/api/Configuration/config.php
## \cp -r configs/config_flextables.json $HTML_DIRECTORY/FlexTables/config.json
## sed -i 's/\@DATA_URL/\"http:\/\/quip-data:9099\"/g' $HTML_DIRECTORY/camicroscope/api/Configuration/config.php
## sed -i 's/\@KUE_URL/\"http:\/\/quip-jobs:3000\"/g' $HTML_DIRECTORY/camicroscope/api/Configuration/config.php
## sed -i 's/\@DATA_URL/http:\/\/quip-data:9099/g' $HTML_DIRECTORY/FlexTables/config.json
viewer_container=$(docker run --name=quip-viewer --net=quip_nw -itd \
	-p $VIEWER_PORT:80 -v $HTML_DIRECTORY:/var/www/html \
	-v $IMAGES_DIR:/data/images \
	quip_viewer)
echo "Started viewer container: " $viewer_container

# Run oss-lite container
oss_container=$(docker run --name quip-oss --net=quip_nw -itd \
	-v $IMAGES_DIR:/data/images camicroscope/oss-lite \
	sh -c "cd /root/src/oss-lite; sh run.sh")
echo "Started oss-lite container: " $oss_container

# Run job orders service container
jobs_container=$(docker run --name quip-jobs --net=quip_nw -itd quip_jobs) 
echo "Started job orders container: " $jobs_container

# Run dynamic services container
\cp -rf configs $STORAGE_FOLDER/.
CONFIGS_DIR=$(echo $STORAGE_FOLDER/configs)
\cp -f $CONFIGS_DIR/config_temp.json $CONFIGS_DIR/config.json
sed -i 's/\@QUIP_JOBS/\"quip-jobs\"/g' $CONFIGS_DIR/config.json
sed -i 's/\@QUIP_OSS/\"quip-oss:5000\"/g' $CONFIGS_DIR/config.json
sed -i 's/\@QUIP_DATA/\"quip-data\"/g' $CONFIGS_DIR/config.json
sed -i 's/\@QUIP_LOADER/\"quip-loader\"/g' $CONFIGS_DIR/config.json
dynamic_container=$(docker run --name quip-dynamic --net=quip_nw -itd \
	-v $CONFIGS_DIR:/tmp/DynamicServices/configs \
	quip_dynamic)
echo "Started dynamic services container: " $dynamic_container

# Run findapi service container
findapi_container=$(docker run --name quip-findapi --net=quip_nw -itd \
	-p $FINDAPI_PORT:3000 \
	-e "MONHOST=$(echo $mongo_host)" \
	-e "MONPORT=$(echo $mongo_port)" \
	quip_findapi)
echo "Started findapi service container: " $findapi_container

