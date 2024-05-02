# Quantitative Imaging in Pathology (QuIP) Software Distribution

## Description

QuIP is a web accessible toolset designed to support analysis, management, and exploration of whole slide tissue images for cancer research.
The QuIP software consists of a set of docker containers, which provide analysis execution and data management backend services, and web
applications to load and visualize whole slide tissue images (in [OpenSlide](http://openslide.org) supported formats), and visualize and
explore the analysis results.

QuIP has several web applications to view whole slide tissue images, view and interact with analysis results, and edit and curate analysis
results. caMicroscope, for example, facilitates the interactive exploration of whole slide tissue images and analysis results (overlaid
on images as polygons or heatmaps).

## Installing and running QuIP

### Requirements

1. docker and docker-compose. You should be able to run docker commands (e.g., pull, run).
2. git
3. Port 80 should be open to access and use the web applications remotely.

### Cloning the distribution repository

Clone this repository.

    git clone https://github.com/SBU-BMI/quip_distro

### Building and running the containers

2) Place yourself in quip\_distro folder.<br>
3) Copy config/httpd.conf.template to config/httpd.conf<br>
4) Configure httpd.conf with your certificates to enable https.<br>
5) Build with, "docker-compose -f quip-pathdb.yml build"<br>
6) Run with, "docker-compose -f quip-pathdb.yml up -d"

## Deep learning methods for histopathology image analysis

We have developed a collection of deep learning methods for analysis of whole slide tissue images. The
methods include deep learning models for predicting spatial distribution of tumor infiltrating lymphocytes,
segmentation and classification of tumor regions, and segmentation of nuclei.

More information about the deep learning models and links to the code repositories
can be found at https://github.com/SBU-BMI/histopathology_analysis

## Loading images and analysis results to QuIP

### Image loader container

The image loader container is deployed when QuIP is installed.

Please see README at https://github.com/SBU-BMI/ImageLoader for user instructions to
load images to QuIP.

### Heatmap loader container

Results from the tumor infiltrating lymphocyte analysis methods and the tumor segmentation methods
are probability maps. The probability maps can be loaded to QuIP as heatmaps using the heatmap loader
container, which is deployed when QuIP is installed.

Please see README at https://github.com/SBU-BMI/uploadHeatmaps for user instructions to load heatmaps
to QuIP.

### Segmentation results loader container

The segmentation results container is deployed, when QuIP is installed. Nucleus segmentation resuilts can be
loaded to QuIP using this container.

Please see README at https://github.com/SBU-BMI/SegmentationLoader for user instructions to load segmentation
results to QuIP.


## Support and Questions
For questions, comments, or any other discussion, please see the [caMicroscope discussion forum](https://github.com/orgs/camicroscope/discussions).

## PathDB

To use PathDB, use quip-pathdb.yml instead of caMicroscope.yml.

Running QuIP with PathDB (https://github.com/SBU-BMI/PathDB):

0) place yourself in quip\_distro folder.<br>
1) copy config/httpd.conf.template to config/httpd.conf<br>
2) configure httpd.conf with your certificates to enable https.<br>
3) build with, "docker-compose -f quip-pathdb.yml build"<br>
4) run with, "docker-compose -f quip-pathdb.yml up -d"

The default login for pathdb is `admin` with password `bluecheese2018`. Please change this password before exposing this service to the internet.

## Using Keycloak as a self-contained Identity Provider
Alternatively, you can use kc_caMicroscope.yml for a keycloak configuration.

* Set up Keycloak (covered by docker compose kc_caMicroscope.yml)
    * URL for this is [http://localhost:8080/admin/master/console/#/](http://localhost:8080/admin/master/console/#/), sub host/port as needed
* Set up realm
    * Add realm called ‘camic’
    * All following steps happen in this realm.
* Set up client
    * Clients -> Add Client
    * Set client_id to camicroscope-test.
    * Openid connect with mostly default settings, but **set client authentication to on**
    * Once saved, Under the credentials tab, get the client secret
    * Add the client secret to config/keycloak_login.html for client_secret.
* Add users
    * Users -> add user
    * Make sure to add an email to match user documents in mongo.
    * Set a password under credentials -> add password

