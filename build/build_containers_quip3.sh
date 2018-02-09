git clone -b multiple_db https://github.com/camicroscope/DataDockerContainer.git; 
git clone -b release https://github.com/camicroscope/LoaderDockerContainer.git; 
cd LoaderDockerContainer; git checkout tags/1.0; cd ..
git clone -b multiple_port https://github.com/camicroscope/ViewerDockerContainer.git; 
git clone -b release https://github.com/camicroscope/OrderingService.git; 
cd OrderingService; git checkout tags/1.0; cd ..
git clone -b release https://github.com/camicroscope/DynamicServices.git; 
cd DynamicServices; git checkout tags/1.0; cd ..
git clone -b release https://github.com/SBU-BMI/findapi.git;
cd findapi; git checkout tags/1.0; cd ..
git clone -b release https://github.com/SBU-BMI/quip_cwl.git
cd quip_cwl; git checkout tags/1.0; cd ..

docker build -t quip_data DataDockerContainer
docker build -t quip_loader:1.0 LoaderDockerContainer
docker build -t quip_viewer ViewerDockerContainer
docker build -t quip_jobs:1.0 OrderingService 
docker build -t quip_dynamic:1.0 DynamicServices 
docker build -t quip_findapi:1.0 findapi
cd quip_cwl/node-kue; docker build -t quip_composite:1.0 . 
