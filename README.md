# QuIP distribution

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

## Support
Feel free to add any support inquiry as a github issue to this repository. Other feedback can be given via [this form](https://docs.google.com/forms/d/e/1FAIpQLScL91LxrpAZjU88GBZP9gmcdgdf8__uNUwhws2lzU6Lr4qNwA/viewform).

