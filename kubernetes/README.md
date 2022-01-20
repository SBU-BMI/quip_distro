# Kubernetes Version of caMicroscope and quip

## FYI
- ALL host mounts are ignored, at least as of now.

## Develop
run `kubectl apply -f develop.yml` to create, cleanup.sh to remove *everything* when done.

When using minikube, run `minikube tunnel` then `minikube service ca-back --url` to get the url.


## caMicroscope
TODO

## quip
TODO
(worried about non-optional config mounts and image mount in particular)
