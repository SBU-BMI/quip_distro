# Kubernetes Version of caMicroscope and quip

Note that the images persistent volume starts empty. Please replace `emptyDir` with an alternate source if required.

## develop and caMicroscope
run `kubectl apply -f develop.yml` to create, cleanup.sh to remove *everything* when done.

When using minikube, run `minikube tunnel` then `minikube service back --url` to get the url.

For instances where security is enabled, after generating keys in 'jwt_keys' and confiuring login.html, run `camicroscope_add_config.sh` or some modification thereof as needed for your configuration.

## quip
* Setup required configuration by running `pathdb_add_config.sh`
* Change the persistent volume configuration in quip-pathdb.yml to match where your slide and other data files are.
* Run `kubectl apply -f quip-pathdb.yml` to create the pod
* When using minikube, run `minikube tunnel` then `minikube service pathdb --url` to get the url.
