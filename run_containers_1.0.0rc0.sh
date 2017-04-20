#!/bin/bash

if [ "$#" -ne 1 ]; then
	echo "./run_containers.sh <install folder>"
	exit 1;
fi

VERSION=latest

VIEWER_DIR=ViewerDockerContainer
if [ ! -d "$VIEWER_DIR" ]; then
	git clone https://github.com/camicroscope/ViewerDockerContainer
	# cd ViewerDockerContainer; git checkout ver-0.9; cd ..;
fi

STORAGE_FOLDER=$1;

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
data_container=$(docker run --name quip-data --net=quip_nw --restart unless-stopped -itd \
	-v $IMAGES_DIR:/data/images \
	-v $DATABASE_DIR:/data/db \
	quip_data)
echo "Started data container: " $data_container

# Run loader container
loader_container=$(docker run --name quip-loader --net=quip_nw --restart unless-stopped -itd \
	-p $IMAGELOADER_PORT:3002 \
	-v $IMAGES_DIR:/data/images \
	-e "mongo_host=$(echo $mongo_host)" \
	-e "mongo_port=$(echo $mongo_port)" \
	-e "dataloader_host=$(echo $data_host)" \
	-e "annotations_host=$(echo $data_host)" \
	quip_loader)
echo "Started loader container: " $loader_container

# Run viewer container

viewer_container=$(docker run --name=quip-viewer --net=quip_nw --restart unless-stopped -itd \
	-p $VIEWER_PORT:80 \
	-v $IMAGES_DIR:/data/images \
	quip_viewer)
echo "Started viewer container: " $viewer_container

# Run oss-lite container
oss_container=$(docker run --name quip-oss --net=quip_nw --restart unless-stopped -itd \
	-v $IMAGES_DIR:/data/images \
	camicroscope/oss-lite sh -c "cd /root/src/oss-lite; sh run.sh")
echo "Started oss-lite container: " $oss_container

# Run job orders service container
jobs_container=$(docker run --name quip-jobs --net=quip_nw --restart unless-stopped -itd sbubmi/quip_jobs:$VERSION) 
echo "Started job orders container: " $jobs_container

# Run dynamic services container
\cp -rf configs $STORAGE_FOLDER/.
CONFIGS_DIR=$(echo $STORAGE_FOLDER/configs)
sed 's/\@QUIP_JOBS/\"quip-jobs\"/g' $CONFIGS_DIR/config_temp.json > $CONFIGS_DIR/config_tmp.json
sed 's/\@QUIP_OSS/\"quip-oss:5000\"/g' $CONFIGS_DIR/config_tmp.json > $CONFIGS_DIR/config.json
sed 's/\@QUIP_DATA/\"quip-data\"/g' $CONFIGS_DIR/config.json > $CONFIGS_DIR/config_tmp.json
sed 's/\@QUIP_LOADER/\"quip-loader\"/g' $CONFIGS_DIR/config_tmp.json > $CONFIGS_DIR/config.json
dynamic_container=$(docker run --name quip-dynamic --net=quip_nw --restart unless-stopped -itd \
	-v $CONFIGS_DIR:/tmp/DynamicServices/configs \
	sbubmi/quip_dynamic:$VERSION)
echo "Started dynamic services container: " $dynamic_container

# Run findapi service container
findapi_container=$(docker run --name quip-findapi --net=quip_nw --restart unless-stopped -itd \
	-p $FINDAPI_PORT:3000 \
	-e "MONHOST=$(echo $mongo_host)" \
	-e "MONPORT=$(echo $mongo_port)" \
	sbubmi/quip_findapi:$VERSION)
echo "Started findapi service container: " $findapi_container


# Run composite dataset generating container
composite_container=$(docker run --name quip-composite --net=quip_nw --restart unless-stopped -itd quip_composite) 
echo "Started composite dataset generating container: " $composite_container



