#!/usr/bin/env bash

file="./app.properties"

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
    echo "$file found."

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
# Clone repository
#
function cloneRepo {
  repo="$2"
  git clone "$1" || error_exit "cannot clone $repo" $LINENO
  cd "$repo" || error_exit 'cannot cd into $repo' $LINENO
  git checkout "tags/$3" || error_exit 'cannot checkout tag' $LINENO
  cd ..
}

#
# Build image
#
function buildImage {
  docker build -t $1:$2 $3 || error_exit 'cannot build image' $LINENO
}

#
# Main program execution
#
readFile

cloneRepo "$data_url" "$data_repo" "$data_tag"
cloneRepo "$loader_url" "$loader_repo" "$loader_tag"
cloneRepo "$viewer_url" "$viewer_repo" "$viewer_tag"
cloneRepo "$ordering_url" "$ordering_repo" "$ordering_tag"
cloneRepo "$dynamic_url" "$dynamic_repo" "$dynamic_tag"
cloneRepo "$find_url" "$find_repo" "$find_tag"
cloneRepo "$cwl_url" "$cwl_repo" "$cwl_tag"

buildImage "$data_image" "$data_tag" "$data_repo"
buildImage "$loader_image" "$loader_tag" "$loader_repo"
buildImage "$viewer_image" "$viewer_tag" "$viewer_repo"
buildImage "$ordering_image" "$ordering_tag" "$ordering_repo"
buildImage "$dynamic_image" "$dynamic_tag" "$dynamic_repo"
buildImage "$find_image" "$find_tag" "$find_repo"
buildImage "$cwl_image" "$cwl_tag" "$cwl_repo/node-kue"
