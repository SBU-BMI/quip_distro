# caMicroscope Distribution
caMicroscope 3.X distribution


run with `docker-compose -f caMicroscope.yml up`

this will build all services and run in the foreground.
Use `docker-compose -f caMicroscope.yml build` to rebuild the services.

Once everything is up, go to <the host this is running on>:4010/ to see the landing page.

## SSL
To enable ssl, mount the private key and certificate files to elevate in /root/src/ssl/privatekey.pem and /root/src/ssl/certificate.pem respectively. HTTPS mode will only be enabled if both of these files are present. 

## Component Services
mongo - vanilla mongo container

idxMongo - ephemeral container to index mongo

bindaas - api service for mongo (see https://github.com/sharmalab/bindaas)

iip - slide tile server (see https://github.com/camicroscope/iipImage)

viewer - hosts the viewer files and builds packages ( see https://github.com/camicroscope/caMicroscope)

loader - extracts metadata needed for image loading (see https://github.com/camicroscope/SlideLoader)

elevate - security proxy (see https://github.com/camicroscope/Security)

## Configuration
Logging - Container Logging is, for HIPAA reasons, disabled. Feel free to use a different logging engine if desired, especially for development.

Security and Routes - This is handled by the elevate service/ca-security container. By default routes go the viewer, unless a specific pattern in routes.json is matched. If security is enabled, supply the SECRET (pub key or secret of JWT) for verification, otherwise set DISABLE_SEC to true.

Image Volume - This is, by default, the images directory in this directory. If this is changed, please make the same change across all impacted services.

Packages - Packages are built in the viewer service using parcel, mount a different directory with packages.js to the package directory to overwrite or add functionality.

## Support
Feel free to add any support inquiry as a github issue to this repository.
