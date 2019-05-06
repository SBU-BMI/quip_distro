FROM alpine:3.9
LABEL maintainer="ashish@dbmi.emory.edu"

### update and include Shadow to manage users and groups
RUN apk update
RUN apk --no-cache add wget
RUN apk --no-cache add shadow

# Add group Bindaas and user Bindaas
RUN groupadd -g 9999 bindaas && \
    useradd -r -u 9999 -g bindaas bindaas

WORKDIR /root/src

RUN apk --no-cache add openjdk8-jre
WORKDIR /root/bindaas/
RUN wget https://github.com/sharmalab/bindaas/releases/download/v3.3.8/bindaas-dist-3.3.8.tar.gz
RUN tar -xvf bindaas-dist-3.3.8.tar.gz && rm bindaas-dist-3.3.8.tar.gz
COPY bindaas.config.json /root/bindaas/bin/
COPY run.sh /root/bindaas/bin/

# Add java to path
ENV PATH /root/src/jre1.8.0_171/bin:$PATH

RUN chown -R bindaas:bindaas /root/

WORKDIR /root/bindaas/bin

USER bindaas

EXPOSE 9099
EXPOSE 8080

CMD ["sh", "run.sh"]
