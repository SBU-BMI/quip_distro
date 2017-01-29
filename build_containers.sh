git clone https://github.com/camicroscope/DataDockerContainer
git clone https://github.com/camicroscope/LoaderDockerContainer
git clone https://github.com/camicroscope/ViewerDockerContainer
git clone https://github.com/camicroscope/oss-lite.git
git clone https://github.com/camicroscope/OrderingService.git
git clone -b quip-distro https://github.com/camicroscope/DynamicServices.git
git clone https://github.com/SBU-BMI/findapi.git

docker build -t quip_data DataDockerContainer
docker build -t quip_loader LoaderDockerContainer
docker build -t quip_viewer ViewerDockerContainer
docker build -t quip_oss oss-lite 
docker build -t quip_jobs OrderingService 
docker build -t quip_dynamic DynamicServices 
docker build -t quip_findapi findapi

