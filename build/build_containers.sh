#!/usr/bin/env bash
git clone -b release https://github.com/camicroscope/DataDockerContainer.git;
git clone -b release https://github.com/camicroscope/LoaderDockerContainer.git; 
git clone -b release https://github.com/camicroscope/ViewerDockerContainer.git; 
git clone -b release https://github.com/camicroscope/OrderingService.git; 
git clone -b release https://github.com/camicroscope/DynamicServices.git; 
git clone -b release https://github.com/SBU-BMI/findapi.git;
git clone -b release https://github.com/SBU-BMI/quip_cwl.git

docker build -t quip_data DataDockerContainer
docker build -t quip_loader LoaderDockerContainer
docker build -t quip_viewer ViewerDockerContainer
docker build -t quip_jobs OrderingService 
docker build -t quip_dynamic DynamicServices 
docker build -t quip_findapi findapi
cd quip_cwl/node-kue; docker build -t quip_composite . 