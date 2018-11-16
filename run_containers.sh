#!/bin/bash

PROGNAME=$(basename "$0")
file="build/app.properties"

#
# Usage
#
function usage() {
    echo "Usage: ./$PROGNAME <install folder>"
    exit 1
}

#
# Error exit
#
function error_exit() {
    echo "${PROGNAME}: ${1:-"Error"}" 1>&2
    echo "Line $2"
    exit 1
}

#
# Read file
#
function readFile {
  if [ -f "$file" ]
  then

    while IFS='=' read -r key value
    do
      key=$(echo $key | tr '.' '_')
      eval ${key}=\${value}
    done < "$file"

  else
    echo "$file not found."
    exit 1
  fi
}

#
# Setup
#
function setup {
    echo "Starting Containers..."

    docker network create quip_nw

    IMAGES_DIR=$(echo $STORAGE_FOLDER/img)
    DATABASE_DIR=$(echo $STORAGE_FOLDER/data)
    COMPOSITE_DATASET_DIR=$(echo $STORAGE_FOLDER/composite_results)

    if [ ! -d "$IMAGES_DIR" ]; then
      mkdir -p $IMAGES_DIR
    fi

    if [ ! -d "$DATABASE_DIR" ]; then
      mkdir -p $DATABASE_DIR
    fi

    if [ ! -d "$COMPOSITE_DATASET_DIR" ]; then
      mkdir -p $COMPOSITE_DATASET_DIR
    fi

    if [ ! -d $STORAGE_FOLDER/configs ]; then
        \cp -rf configs $STORAGE_FOLDER/.
    fi

    CONFIGS_DIR=$(echo $STORAGE_FOLDER/configs)

}

#
# Run containers
#
function runContainers {
    ## Run data container
    data_id=$(docker run --name $data_container --net=quip_nw --restart unless-stopped -itd \
      -p 27017:27017 \
         -v quip_bindaas:/root/bindaas \
        -v $IMAGES_DIR:/data/images \
        -v $DATABASE_DIR:/var/lib/mongodb \
        $data_image:$data_tag) || error_exit 'data' $LINENO
    echo "Started data container: " $data_id

    echo "This might take 30 seconds"
    sleep 15

    ## Run loader container
    loader_id=$(docker run --name $loader_container --net=quip_nw --restart unless-stopped -itd \
        -v $IMAGES_DIR:/data/images \
        -e "mongo_host=$(echo $mongo_host)" \
        -e "mongo_port=$(echo $mongo_port)" \
        -e "dataloader_host=$(echo $data_host)" \
        -e "annotations_host=$(echo $data_host)" \
        $loader_image:$loader_tag) || error_exit 'loader' $LINENO
    echo "Started loader container: " $loader_id

    ## Run viewer container
    viewer_id=$(docker run --name=$viewer_container --net=quip_nw --restart unless-stopped -itd \
        -p $VIEWER_PORT:80 \
        -v $IMAGES_DIR:/data/images \
      -v $COMPOSITE_DATASET_DIR:/var/www/html/composite_results \
        -v $STORAGE_FOLDER/configs/config:/var/www/html/config \
        $viewer_image:$viewer_tag) || error_exit 'viewer' $LINENO
    echo "Started viewer container: " $viewer_id

    ## Run oss-lite container
    oss_id=$(docker run --name quip-oss --net=quip_nw --restart unless-stopped -itd \
        -v $IMAGES_DIR:/data/images \
        camicroscope/oss-lite:latest sh -c "cd /root/src/oss-lite; sh run.sh") || error_exit 'oss' $LINENO
    echo "Started oss-lite container: " $oss_id

    ## Run job orders service container
    jobs_id=$(docker run --name $ordering_container --net=quip_nw --restart unless-stopped -itd $ordering_image:$ordering_tag) || error_exit 'jobs' $LINENO
    echo "Started job orders container: " $jobs_id

    # Run findapi service container
    findapi_id=$(docker run --name $find_container --net=quip_nw --restart unless-stopped -itd \
        -e "MONHOST=$(echo $mongo_host)" \
        -e "MONPORT=$(echo $mongo_port)" \
        $find_image:$find_tag) || error_exit 'find' $LINENO
    echo "Started findapi service container: " $findapi_id

    # Run composite dataset generating container
    #composite_id=$(docker run --name $composite_container --net=quip_nw --restart unless-stopped -itd $composite_image:$composite_tag) || error_exit 'composite' $LINENO
    #echo "Started composite dataset generating container: " $composite_id

    ## Run dynamic services container
    sed 's/\@QUIP_JOBS/\"quip-jobs\"/g' $CONFIGS_DIR/config_temp.json > $CONFIGS_DIR/config_tmp.json
    sed 's/\@QUIP_OSS/\"quip-oss:5000\"/g' $CONFIGS_DIR/config_tmp.json > $CONFIGS_DIR/config.json
    sed 's/\@QUIP_DATA/\"quip-data\"/g' $CONFIGS_DIR/config.json > $CONFIGS_DIR/config_tmp.json
    sed 's/\@QUIP_LOADER/\"quip-loader\"/g' $CONFIGS_DIR/config_tmp.json > $CONFIGS_DIR/config.json

    dynamic_id=$(docker run --name $dynamic_container --net=quip_nw --restart unless-stopped -itd \
        -v $CONFIGS_DIR:/tmp/DynamicServices/configs \
        $dynamic_image:$dynamic_tag) || error_exit 'dynamic' $LINENO
    echo "Started dynamic services container: " $dynamic_id
}



#
# Main program execution
#
if [ "$#" -ne 1 ]; then
    usage
else
    STORAGE_FOLDER=$1

    # Constants
    VERSION=2.0
    VIEWER_PORT=80
    IMAGELOADER_PORT=6002
    FINDAPI_PORT=3000
    data_host="http://quip-data:9099"
    mongo_host="quip-data"
    mongo_port=27017

fi

readFile

setup

runContainers
