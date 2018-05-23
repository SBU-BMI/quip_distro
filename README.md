QuIP is a web accessible toolset designed to support analysis, management, and exploration of whole slide tissue images for cancer research. The QuIP system consists of a set of docker containers, which provide analysis execution and data management backend services, and web applications to load and visualize whole slide tissue images (in [OpenSlide](http://openslide.org) supported formats), run nuclear segmentation analyses on image tiles, and visualize and explore the analysis results.

## QuIP Video

This [video](https://www.youtube.com/watch?v=dK4c6ti1Dvc) shows the basic usage of the QuIP system.

## QuIP Demo VM

You may download a demo VMWare VM (in the OVA format) containing all of the docker images and web applications from the following [link](https://drive.google.com/file/d/0B9Sq9MWc46AuOHBZR0tGMTlXOU0/view?usp=sharing). The download size is 16GB. The VM was generated using VMWare Fusion 8.5.3 and may not be compatible with earlier versions of VMWare tools.  

The VM starts all the containers on boot. It is configured to use 2GB memory and 2 CPU cores. Please wait for about 30 seconds for the start process to complete. You can log on to the VM with userid: **quip** and password: **quipdemo**. The Google Chrome browser will open automatically upon login and will bring up the QuIP home page. A TCGA whole slide tissue image is already loaded to the system along with some analysis results. There are additional TCGA whole slide tissue images on /home/quip/Desktop which can be loaded using the Image Loader app accessible from the home page.

<!--
## Public Read-only Instance

An instance of QuIP is accessible [here](http://quip1.bmi.stonybrook.edu). The image analysis functionality is disabled in this instance.
This instance is backed by a database of about 1.9 Billion segmented objects and their features (17 features per segmented nuclues; a
total of 32 Billion features) generated from about 3,000 TCGA whole slide tissue images.
-->

# Requirements

1. [docker](https://www.docker.com) should be installed. You should be able to run docker commands (e.g., pull, run).
2. [git](https://git-scm.com) should be installed.
3. QuIP requires access to a folder (data folder) on the host machine to store whole slide tissue images
   and the database. You should have read and write permissions to the folder.
4. The installation scripts and the QuIP software have been tested on Linux systems and with the Google Chrome
   browser.
5. The following three ports should be open to be able to use the web applications: 80, 6002, 3000.

# Cloning the distribution repository

Clone this repository.

    git clone https://github.com/SBU-BMI/quip_distro

# Running the containers

Before pulling and running the containers, create a data folder if it does not exist. The data folder will be used to
store images and the database as well as configuration files required by the containers. Note you should have read and write
permissions to the folder.

*** SKIP "Building" and go to "Running" if you are not doing software development on QuIP.  Pre-built dockers will be dowloaded from Docker Hub instead ***

# Building
Execute the build_containers.sh script. At the command prompt:

    cd <path to your github repositories folder>
    <path to quip_distro folder>/build/build_containers.sh

# Running
Execute the run_containers.sh script. At the command prompt:

    cd <path to quip_distro folder>
    ./run_containers.sh <full path of data folder>


The startup process will create an "img" sub-folder in the data folder where tissue images will be stored and
a "data" sub-folder where the database files will be stored. Please make sure the storage folder has enough
space for images and the database.

The startup process will pull the QuIP containers from their respective docker image repositories, create a user-defined
docker network (quip_nw), start up the containers and attach them to the user-defined docker network.

After the containers are started, you may access the QuIP web applications using a browser at `http://<hostname>`. Here, hostname is the name or IP address of the host machine where the containers are running.

### Configuration

Configuration is via configs/viewer/config.ini per the following specifications

| Key | Function | Default |
| --- | --- | --- |
|trusted_secret| bindaas trusted secret | - |
|disable_security| a boolean which disables user login if true | false |
|trusted_id | the application name for bindaas | camicSignup |
|trusted_url | the bindaas endpoint for trust |http://quip-data:9099/trustedApplication |
|client_id | client id from google oauth setup | an unusable value|
|client_secret | client secret from google oauth setup | an unusable value|
|redirect_uri | the redirection to take after oauth setup | postmessage|
|title| the title as shown on the page title and some headers | caMicroscope|
|suffix | a tagline printed after the title on the login page | empty |
|description | a description of the application/deployment | Look at Slides |
| footer | designed for grant or contact information | caMicroscope – A Digital Pathology Integrative Query System; Ashish Sharma PI Emory |
|download_link | the url linked to on the download button | https://github.com/camicroscope |
|folder_path| the relative path of the folder | \/ |
| dataHost | the data container’s name and port | quip-data:9099 |
|kueHost | the jobs container’s name and port | quip-jobs:3000 |

## Citation
When using QuIP or caMicroscope, please cite the following:

Saltz, J., Sharma, A., Iyer, G., Bremer, E., Wang, F., Jasniewski, A., DiPrima, T., Almeida, J.S., Gao, Y., Zhao, T., et al. (2017). A Containerized Software System for Generation, Management, and Exploration of Features from Whole Slide Tissue Images. Cancer Res. 77, e79–e82.

caMicroscope — A Platform for Digital Pathology Data Management and Visualization http://camicroscope.org
