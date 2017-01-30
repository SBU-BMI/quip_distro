# Building and running the QUIP containers

# Create an installation folder

Please create an installation folder. This folder should be writable by you and should be on a file system with 
enough storage space to store images and analysis results.

# Clone the distro repository

Go to the installation folder and clone this repository.

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

The start_containers.sh script expects the full path of the installation folder. The data and configuration files for the 
containers will be stored in this folder. The startup process will create an "img" folder in which the software will store 
and manage whole slide tissue images. Startup will also create a "data" sub-folder in the installation folder. The 
data subfolder will be used for the FeatureDB database, which manages image metadata and analysis results. Please make 
sure the storage folder has enough space for images and the database. 

Run ./start_containers.sh <path of the installation folder> to start the containers. 

