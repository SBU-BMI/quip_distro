git clone -b release https://github.com/camicroscope/DataDockerContainer.git; 
cd DataDockerContainer; git checkout tags/1.0.0rc1; cd ..;

git clone -b release https://github.com/camicroscope/LoaderDockerContainer.git; 
cd LoaderDockerContainer; git checkout tags/1.0.0rc1; cd ..;

git clone -b release https://github.com/camicroscope/ViewerDockerContainer.git; 
cd ViewerDockerContainer; git checkout tags/1.0.0rc1; cd ..;

git clone -b release https://github.com/camicroscope/OrderingService.git; 
cd OrderingService; git checkout tags/1.0.0rc1; cd ..;

git clone -b release https://github.com/camicroscope/DynamicServices.git; 
cd DynamicServices; git checkout tags/1.0.0rc1; cd ..;

git clone -b release https://github.com/SBU-BMI/findapi.git;
cd findapi; git checkout tags/1.0.0rc1; cd ..;

git clone -b release https://github.com/SBU-BMI/quip_cwl.git
cd quip_cwl; git checkout tags/1.0.0rc1; cd ..;

docker build -t quip_data DataDockerContainer
docker build -t quip_loader LoaderDockerContainer
docker build -t quip_viewer ViewerDockerContainer
docker build -t quip_jobs OrderingService 
docker build -t quip_dynamic DynamicServices 
docker build -t quip_findapi findapi
cd quip_cwl/node-kue; docker build -t quip_composite . 
