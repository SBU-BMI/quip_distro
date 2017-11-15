
git clone -b develop https://github.com/camicroscope/ViewerDockerContainer.git;
git clone -b develop https://github.com/camicroscope/DynamicServices.git;
git clone -b develop https://github.com/SBU-BMI/quip_cwl.git


docker build -t quip_viewer ViewerDockerContainer
docker build -t quip_dynamic DynamicServices
cd quip_cwl/node-kue; docker build -t quip_composite .
cd ../..
