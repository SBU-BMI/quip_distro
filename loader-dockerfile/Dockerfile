# Loaders
    # Image Loader
    # Markup Loader

# References:
# http://docs.opencv.org/3.0-beta/doc/tutorials/introduction/desktop_java/java_dev_intro.html
# http://rodrigoberriel.com/2014/10/installing-opencv-3-0-0-on-ubuntu-14-04/


FROM     ubuntu:14.04
MAINTAINER Ganesh Iyer "lastlegion@gmail.com"

### update
RUN apt-get -q update
# RUN apt-get -q -y upgrade
# RUN apt-get -q -y dist-upgrade
# RUN apt-get install -q -y libcurl3 

### need build tools for building openslide and later iipsrv
RUN apt-get -q -y install libcurl3 git autoconf automake make libtool pkg-config cmake

RUN mkdir /root/src

### prereqs for openslide
RUN apt-get -q -y install zlib1g-dev libpng12-dev libjpeg-dev \
		libtiff5-dev libgdk-pixbuf2.0-dev libxml2-dev \
		libsqlite3-dev libcairo2-dev libglib2.0-dev

WORKDIR /root/src

# Openslide
RUN apt-get install -y openslide-tools python3-openslide \
		python3 python3-setuptools python3-pip \
		nodejs npm

# Data Loader API
RUN mkdir -p /root/dataloader
WORKDIR /root/dataloader
EXPOSE 3001
RUN git clone --recursive https://github.com/camicroscope/ImageLoader.git .
RUN git submodule update --recursive --remote
RUN npm install

RUN ["pip3","install", "-r",  "/root/dataloader/DataLoader/requirements.txt"]
EXPOSE 3000

###################
# Annotations Loader
###################

# RUN apt-get -y install libopencv-dev build-essential cmake git \
# 		libgtk2.0-dev pkg-config python-dev python-numpy \
# 		libdc1394-22 libdc1394-22-dev libjpeg-dev libpng12-dev \
# 		libtiff4-dev libjasper-dev libavcodec-dev \
# 		libavformat-dev libswscale-dev libxine-dev \
# 		libgstreamer0.10-dev libgstreamer-plugins-base0.10-dev \
# 		libv4l-dev libtbb-dev libqt4-dev  libmp3lame-dev \
# 		libopencore-amrnb-dev libopencore-amrwb-dev \
# 		libtheora-dev libvorbis-dev libxvidcore-dev \
# 		x264 v4l-utils unzip wget

RUN apt-get -y install build-essential pkg-config unzip wget curl

# Install JDK
RUN apt-get -y install openjdk-7-jdk ant
ENV JAVA_HOME /usr/lib/jvm/java-7-openjdk-amd64/
ENV PATH $JAVA_HOME/bin:$PATH

# COPY opencv3_0_0_java.sh /root/
# RUN sh opencv3_0_0_java.sh

# Install OpenCV 3.1.0 
WORKDIR /tmp
RUN curl -O -J -L https://github.com/Itseez/opencv/archive/3.1.0.zip && \
	unzip opencv-3.1.0.zip && \
	mkdir /tmp/opencv-build && \
	cd /tmp/opencv-build && \
	cmake -D CMAKE_BUILD_TYPE=RELEASE -D BUILD_SHARED_LIBS=OFF -D BUILD_TESTS=OFF -D CMAKE_INSTALL_PREFIX=/usr/local ../opencv-3.1.0 && \
	make -j4 && \
	make install && \
	cd /tmp && \
	rm -rf opencv-build && \
	rm -rf opencv-3.1.0* 

WORKDIR /root

# Install nuclear segmentation results program
# RUN apt-get -y install gradle
# WORKDIR /root
# COPY nuclear-segmentation-results2 /root/nuclear-segmentation-results
# ENV OPENCV_DIR /root/OpenCV/opencv-3.0.0/build
# ENV OPENCV_JAVA_LIB /root/OpenCV/opencv-3.0.0/build/bin/opencv-300.jar
ENV OPENCV_JAVA_DIR=/usr/local/share/OpenCV/java
ENV OPENCV_JAVA_LIB=$OPENCV_JAVA_DIR/opencv-310.jar
# WORKDIR /root/nuclear-segmentation-results
# RUN gradle build

# RUN apt-get -y install execstack 
# RUN execstack -c /root/OpenCV/opencv-3.0.0/build/lib/libopencv_java300.so


WORKDIR /root
RUN git clone https://github.com/camicroscope/uAIMDataLoader.git annotationloader

WORKDIR /root/annotationloader

RUN npm install 

RUN npm install yargs   #Annoying unlisted kue dependency
COPY config.js.annotationsloader config.js
COPY config.js.dataloader /root/dataloader/config.js

WORKDIR /root

# RUN apt-get -q update
# RUN apt-get -q -y upgrade
RUN "sh" "-c" "echo nameserver 8.8.8.8 >> /etc/resolv.conf"

RUN apt-get -y install redis-server

# Install forever
RUN  ln -s "$(which nodejs)" /usr/bin/node
RUN npm install -g forever

# Install new zip loader
RUN apt-get -y -q install curl
RUN curl -O -J -L https://services.gradle.org/distributions/gradle-2.13-bin.zip && \
    unzip gradle-2.13-bin.zip && \
    mv gradle-2.13 /usr/local && \
    rm -rf gradle-2.13* 
ENV GRADLE_HOME=/usr/local/gradle-2.13
ENV PATH=$GRADLE_HOME/bin:$PATH
# ENV OPENCV_JAVA_DIR /root/OpenCV/opencv-3.0.0/build
ENV FEATUREDB_DIR=/usr/local/pathomics_featuredb

WORKDIR /tmp/
RUN git clone https://github.com/SBU-BMI/pathomics_featuredb && \
	cd pathomics_featuredb/src && \
	gradle build && \
	gradle installDist && \
	cd /tmp && mv pathomics_featuredb /usr/local/. && \
	cp $FEATUREDB_DIR/docker_scripts/run* /usr/local/bin/. && \
	cp $FEATUREDB_DIR/script/run* /usr/local/bin/. && \
	cd /tmp

COPY redis.conf /etc/redis/redis.conf

WORKDIR /root
COPY run.sh /root/

CMD ["sh", "run.sh"]
