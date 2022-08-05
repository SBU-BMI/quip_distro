#!/usr/bin/env bash
kubectl create secret generic camic-jwt-keys --from-file=key=../jwt_keys/key --from-file=key.pub=../jwt_keys/key.pub
kubectl create configmap camic-login --from-file=login.html=../config/login.html
