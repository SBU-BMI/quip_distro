#!/usr/bin/env bash
cp /etc/httpd/conf/quip.key /keys/key
cp /etc/httpd/conf/quip.crt /keys/key.pub
sh /root/run.sh
