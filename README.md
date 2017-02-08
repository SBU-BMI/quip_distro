QuIP is a web accessible toolset designed to support analysis, management, and exploration of whole slide tissue images for cancer research. The QuIP system consists of a set of docker containers, which provide analysis execution and data management backend services, and web applications to load and visualize whole slide tissue images (in [OpenSlide](http://openslide.org) supported formats), run nuclear segmentation analyses on image tiles, and visualize and interact with analysis results. 

This [video](https://www.youtube.com/watch?v=dK4c6ti1Dvc) shows the use of the QuIP system.

An instance of QuIP is accessible [here](http://quip1.bmi.stonybrook.edu). The image analysis functionality is disabled in this instance. 
This instance is backed by a database of about 1.9 Billion segmented objects and their features (17 features per segmented nuclues; a 
total of 32 Billion features) generated from about 3,000 TCGA whole slide tissue images. 

You may download a demo VMWare VM containing all of the docker images and web applications from the following [link](https://drive.google.com/file/d/0B1w9_31CAt25c3E5RVhfQXVGTUE/view?usp=sharing). The userid is quip; the password is quipbmi2017.

# Requirements

1. [docker](https://www.docker.com) should be installed. You should be able to run docker commands (e.g., pull, run).
2. [git](https://git-scm.com) should be installed.
3. QuIP requires access to a folder (data folder) on the host machine to store whole slide tissue images 
   and the database. You should have read/write permissions to the folder.
4. The installation scripts and the QuIP software have been tested on Linux systems and with Google Chrome 
   browser. 
5. The following three ports should be open to be able to use the web applications: 80, 6002, 3000. 
   
# Clone the distribution repository

Clone this repository.

         git https://github.com/SBU-BMI/quip_distro
         
# Run the containers

Before pulling and running the containers, create a data folder if one does not exist. The data folder will be used to 
store images and the database as well as configuration files required by the containers.

Execute run_containers.sh script. At the command prompt, 

$ ./run_containers.sh \<full path of data folder\> 

The startup process will create an "img" sub-folder in the data folder where tissue images will be stored and 
a "data" sub-folder where the database files will be stored. Please make sure the storage folder has enough 
space for images and the database. 

The startup process will pull the QuIP containers from their respective docker image repositories, create a user-defined 
docker network (quip_nw), start up the containers and attach them to the user-defined docker network. 

After the containers are started, you may access the QuIP web applications using a browser at http://\<hostname\>. Here, hostname is the name or IP address of the host machine where the containers are installed and running. 



 




