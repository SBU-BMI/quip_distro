# Building and running the QUIP containers

# Clone the distro repository

Clone this repository in a folder where you will build and start the containers from.

# Build the containers

Run ./build_containers.sh 

The build process will clone several public repositories and build docker images. If the build process
completes successfully, you can run `docker images | grep quip` to get a list of the containers. You 
should see the following list of containers:

quip_findapi    
quip_dynamic   
quip_jobs     
quip_oss     
quip_viewer 
quip_loader   
quip_data    

# Start the containers

The start_containers.sh script expects the full path of the storage folder where data and configuration files for the 
QUIP containers will be stored. The img folder will be used by QUIP to store and manage whole slide tissue images. The 
data folder will be used for the FeatureDB database, which manages image metadata and analysis results. Please make 
sure the storage folder has enough space for images and the database. 

Assume the storage folder path is /data/quip . 

Run ./start_containers.sh /data/quip to start the containers. The startup process will create /data/quip/img and /data/quip/data 
folders and store configuration information in /data/quip/configs and /data/quip/html folder. 

