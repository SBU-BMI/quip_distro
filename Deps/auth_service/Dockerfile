FROM node:8
RUN mkdir /root/src
COPY . /root/src
WORKDIR /root/src

RUN npm install
RUN npm install -g forever
EXPOSE 8010
CMD forever app.js
