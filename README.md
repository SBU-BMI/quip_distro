# caMicroscope Distribution

[![Build Status](https://travis-ci.org/camicroscope/Distro.svg?branch=master)](https://travis-ci.org/camicroscope/Distro)

caMicroscope 3.X distribution


run with `docker-compose -f caMicroscope.yml up`

this will build all services and run in the foreground.
Use `docker-compose -f caMicroscope.yml build` to rebuild the services.

Once everything is up, go to <the host this is running on>:4010/ to see the landing page.

## SSL
To enable ssl, mount the private key and certificate files to the security service in /root/src/ssl/privatekey.pem and /root/src/ssl/certificate.pem respectively. HTTPS mode will only be enabled if both of these files are present.

## Component Services
mongo - vanilla mongo container

idxMongo - ephemeral container to index mongo (that is, this container is *expected* to exit once it's done its job)

bindaas - api service for mongo (see https://github.com/sharmalab/bindaas)

iip - slide tile server (see https://github.com/camicroscope/iipImage)

viewer - hosts the viewer files and builds packages ( see https://github.com/camicroscope/caMicroscope)

loader - extracts metadata needed for image loading (see https://github.com/camicroscope/SlideLoader)

security - security proxy (see https://github.com/camicroscope/Security)

## Configuration
Logging - Container Logging is, for HIPAA reasons, disabled. Feel free to use a different logging engine if desired, especially for development.

Security and Routes - This is handled by the security container. By default routes go the viewer, unless a specific pattern in routes.json is matched. If security is enabled, supply the SECRET (pub key or secret of JWT) for verification, otherwise set DISABLE_SEC to true.

Image Volume - This is, by default, the images directory in this directory. If this is changed, please make the same change across all impacted services.

Packages - Packages are built in the viewer service using parcel, mount a different directory with packages.js to the package directory to overwrite or add functionality.

## PathDB

To use PathDB, use quip-pathdb.yml instead of caMicroscope.yml. This deployment does not include the auth and loader as separate services, as this PathDB provides that functionality.

Running QuIP with PathDB:

0) place yourself in quip\_distro folder.<br>
1) copy config/httpd.conf.template to config/httpd.conf<br>
2) copy config/pathdb\_routes.json to config/routes.json (this will overwrite an existing routes.json file)<br>
3) configure httpd.conf with your certificates to enable https.<br>
4) build with, "docker-compose -f quip-pathdb.yml build"<br>
5) run with, "docker-compose -f quip-pathdb.yml up -d"

## Support
Feel free to add any support inquiry as a github issue to this repository. Other feedback can be given via [this form](https://docs.google.com/forms/d/e/1FAIpQLScL91LxrpAZjU88GBZP9gmcdgdf8__uNUwhws2lzU6Lr4qNwA/viewform).
