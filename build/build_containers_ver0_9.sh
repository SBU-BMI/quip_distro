git clone https://github.com/camicroscope/DataDockerContainer; cd DataDockerContainer; git checkout ver-0.9; cd ..;
git clone https://github.com/camicroscope/LoaderDockerContainer; cd LoaderDockerContainer; git checkout ver-0.9; cd ..;
git clone https://github.com/camicroscope/ViewerDockerContainer; cd ViewerDockerContainer; git checkout ver-0.9; cd ..;
git clone https://github.com/camicroscope/OrderingService.git; cd OrderingService; git checkout ver-0.9; cd ..;
git clone -b quip-distro https://github.com/camicroscope/DynamicServices.git; cd DynamicServices; git checkout ver-0.9; cd ..;
git clone https://github.com/SBU-BMI/findapi.git; cd DataDockerContainer; git checkout ver-0.9; cd ..;

docker build -t quip_data DataDockerContainer
docker build -t quip_loader LoaderDockerContainer
docker build -t quip_viewer ViewerDockerContainer
docker build -t quip_jobs OrderingService 
docker build -t quip_dynamic DynamicServices 
docker build -t quip_findapi findapi

