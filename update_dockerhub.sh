#!/usr/bin/env bash

# need permission
docker login
# build images
docker-compose -f quip-pathdb.yml build
docker-compose -f caMicroscope.yml build
# tag and push images
docker tag distro_imageloader:latest camicroscope/pathdb-imageloader:latest
docker push camicroscope/pathdb-imageloader:latest
docker tag distro_heatmaploader:latest camicroscope/pathdb-heatmaploader:latest
docker push camicroscope/pathdb-heatmaploader:latest
docker tag distro_segloader:latest camicroscope/pathdb-segloader:latest
docker push camicroscope/pathdb-segloader:latest
docker tag distro_pathdb:latest camicroscope/pathdb:latest
docker push camicroscope/pathdb:latest
# iip, caracal, and slideloader are done on commit and tag
