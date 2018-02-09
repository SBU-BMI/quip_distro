#!/bin/bash

docker stop quip-viewer
docker rm   quip-viewer
docker rmi  quip_viewer


git clone -b multiple_port https://github.com/camicroscope/ViewerDockerContainer.git; 

docker build --no-cache -t quip_viewer ViewerDockerContainer


STORAGE_FOLDER="/home/feiqiao/quip2/"
COMPOSITE_DATASET_ZIP="/home/feiqiao/shapely/"

IMAGES_DIR=$(echo $STORAGE_FOLDER/img)
DATABASE_DIR=$(echo $STORAGE_FOLDER/data)

VIEWER_PORT=80
VIEWER_PORT2=8080
IMAGELOADER_PORT=6002
FINDAPI_PORT=3000

data_host="http://quip-data:9099"
mongo_host="quip-data"
mongo_port=27017

## Run viewer container
viewer_container=$(docker run --name=quip-viewer --net=quip_nw --restart unless-stopped -itd \
	-p $VIEWER_PORT:80 \
 	-p $VIEWER_PORT2:8080 \
	-v $IMAGES_DIR:/data/images \
	-v $STORAGE_FOLDER/configs/security:/var/www/html/config \
    -v $STORAGE_FOLDER/configs/security:/var/www/html2/config \
    -v $COMPOSITE_DATASET_ZIP/composite_results_zip:/var/www/html2/composite_results_zip \
	quip_viewer)
echo "Started viewer container: " $viewer_container
