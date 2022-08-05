#!/bin/bash
kubectl delete --all service
kubectl delete --all deploy
kubectl delete --all pod
kubectl delete --all secret
kubectl delete --all configmap
