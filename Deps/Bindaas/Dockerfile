FROM ubuntu:16.04
MAINTAINER Pradeeban Kathiravelu "kk.pradeeban@gmail.com"


# build with
#  sudo docker build --rm=true -t="repo/imgname" .

### update
RUN apt-get -q update
RUN apt-get -q -y upgrade
RUN apt-get -q -y dist-upgrade
RUN apt-get install -q -y libcurl3

# Java
RUN mkdir /root/src

WORKDIR /root/src

RUN apt-get install -y openjdk-8-jre

# Add java to path
ENV PATH /root/src/jre1.8.0_171/bin:$PATH


# Bindaas
RUN mkdir -p /root/bindaas

ADD https://github.com/sharmalab/bindaas/releases/download/v3.0.2/bindaas-dist-3.0.2.tar.gz /root/bindaas/

WORKDIR /root/bindaas
RUN ls
RUN mv bindaas-dist-3.0.2.tar.gz bindaas.tar.gz 2>&1; exit 0
RUN tar -xvf bindaas.tar.gz 2>&1; exit 0
RUN rm bindaas.tar.gz 2>&1; exit 0

COPY bindaas.config.json /root/bindaas/bin/

EXPOSE 9099
EXPOSE 8080
WORKDIR /root/bindaas/bin

COPY /run.sh /root/bindaas/bin/run.sh


CMD ["sh", "run.sh"]
