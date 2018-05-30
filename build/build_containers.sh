#!/usr/bin/env bash
git clone "https://github.com/camicroscope/DataDockerContainer.git";
cd DataDockerContainer; git checkout tags/2.0; cd ..
git clone "https://github.com/camicroscope/LoaderDockerContainer.git";
cd LoaderDockerContainer; git checkout tags/2.0; cd ..
git clone "https://github.com/camicroscope/ViewerDockerContainer.git";
cd ViewerDockerContainer; git checkout tags/2.0.1; cd ..
git clone "https://github.com/camicroscope/OrderingService.git";
cd OrderingService; git checkout tags/2.0; cd ..
git clone "https://github.com/camicroscope/DynamicServices.git";
cd DynamicServices; git checkout tags/2.0; cd ..
git clone "https://github.com/SBU-BMI/findapi.git";
cd findapi; git checkout tags/2.0; cd ..
git clone "https://github.com/SBU-BMI/quip_cwl.git";
cd quip_cwl; git checkout tags/2.0; cd ..

docker build -t sbubmi/quip_data:2.0 DataDockerContainer
docker build -t sbubmi/quip_loader:2.0 LoaderDockerContainer
docker build -t sbubmi/quip_viewer:2.0 ViewerDockerContainer
docker build -t sbubmi/quip_jobs:2.0 OrderingService
docker build -t sbubmi/quip_dynamic:2.0 DynamicServices
docker build -t sbubmi/quip_findapi:2.0 findapi
cd quip_cwl/node-kue; docker build -t sbubmi/quip_composite:2.0 .
