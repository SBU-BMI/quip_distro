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


## Support
Feel free to add any support inquiry as a github issue to this repository. Other feedback can be given via [this form](https://docs.google.com/forms/d/e/1FAIpQLScL91LxrpAZjU88GBZP9gmcdgdf8__uNUwhws2lzU6Lr4qNwA/viewform).

# caMicroscope Distribution Information

<h2 align="center">
  <a href="http://camicroscope.org/"><img src="https://avatars2.githubusercontent.com/u/12075069?s=400&v=4" style="background-color:rgba(0,0,0,0);" height=230 alt="camicroscope: a web-based image viewer optimized for large bio-medical image data viewing"></a>
</h2>

[![Build Status](https://travis-ci.org/camicroscope/Distro.svg?branch=master)](https://travis-ci.org/camicroscope/Distro)

# caMicroscope distribution


run with `docker-compose -f caMicroscope.yml up`

this will build all services and run in the foreground.
Use `docker-compose -f caMicroscope.yml build` to rebuild the services.

Once everything is up, go to http://localhost:4010/ to see the landing page.

## SSL
To enable ssl, mount the private key and certificate files to the ca-back service in /root/src/ssl/privatekey.pem and /root/src/ssl/certificate.pem respectively. HTTPS mode will only be enabled if both of these files are present.

## Component Services
mongo - vanilla mongo container

idxMongo - ephemeral container to index mongo (that is, this container is *expected* to exit once it's done its job)

iip - slide tile server (see https://github.com/camicroscope/iipImage)

loader - extracts metadata needed for image loading (see https://github.com/camicroscope/SlideLoader)

back - security, data, and routing (see https://github.com/camicroscope/caracal)

back/viewer - within back, viewer files ( see https://github.com/camicroscope/caMicroscope)

## Configuration
Logging - Logging is enabled by default with a set configurable maximum size. If you need to disable logs, for example due to HIPAA requirements, set the logging driver to none.

See backend and security config notes [here](https://github.com/camicroscope/caracal).

Image Volume - This is, by default, the images directory in this directory. If this is changed, please make the same change across all impacted services.

## Securing caMicroscope

### Getting an Identity Provider and Setting up Login

When selecting, an identity provider, note that we expect it to provide a JWT, and to have a certificate/public key/secret which can be used to verify such JWTs.

The example given in the Distro within config/login.html is set up to use google as an identity provider. See [this guide from google](https://developers.google.com/identity/sign-in/web/sign-in) to set up your own project, which is necessary to enable login on your instance.

### Adding Users to caMicroscope

Add users as in ./config/add\_users.js. This can be done either by editing this file before bringing up the stack, or by running similar code against the camic database in ca-mongo. Attributes can be added to deny access to routes (e.g. allow only some users to post and delete) and userFilters can be used to change visibility of particular documents.

The email field is the email field (or failing that, sub field) in that priority from the identity provider.

## PathDB

To use PathDB, use quip-pathdb.yml instead of caMicroscope.yml.

Running QuIP with PathDB (https://github.com/SBU-BMI/PathDB):

0) place yourself in quip\_distro folder.<br>
1) copy config/httpd.conf.template to config/httpd.conf<br>
2) configure httpd.conf with your certificates to enable https.<br>
3) build with, "docker-compose -f quip-pathdb.yml build"<br>
4) run with, "docker-compose -f quip-pathdb.yml up -d"

## Support
Feel free to add any support inquiry as a github issue to this repository. Other feedback can be given via [this form](https://docs.google.com/forms/d/e/1FAIpQLScL91LxrpAZjU88GBZP9gmcdgdf8__uNUwhws2lzU6Lr4qNwA/viewform).

## System Recommendations
As of 3.8.0, the non-pathdb caMicroscope deployment seems to peak about 500mb of memory per user from basic tests. The system is most likely to work optimally if the CPU can support two or three threads per concurrent user. The containers themselves take up a total of about 6gb of disk, but note that whole slide images typically use 0.5-2 gb of disk each.

## Open Source Development
We have a discussion mailing list! Stop by and discuss all things caMicroscope. https://groups.google.com/forum/#!forum/camicroscope
