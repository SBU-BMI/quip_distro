git clone -b develop https://github.com/camicroscope/DataDockerContainer.git;
git clone https://github.com/camicroscope/LoaderDockerContainer.git; 
git clone -b remove_mount_html https://github.com/camicroscope/ViewerDockerContainer.git; 
git clone https://github.com/camicroscope/OrderingService.git; 
git clone https://github.com/camicroscope/DynamicServices.git;
git clone https://github.com/SBU-BMI/findapi.git; 

docker build -t quip_data DataDockerContainer
docker build -t quip_loader LoaderDockerContainer
docker build -t quip_viewer ViewerDockerContainer
docker build -t quip_jobs OrderingService 
docker build -t quip_dynamic DynamicServices 
docker build -t quip_findapi findapi

