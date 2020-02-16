#!/bin/bash

docker run -d --name ipfs-node \
  -v /opt/ipfs-docker-staging:/export -v /opt/ipfs-docker-data:/data/ipfs \
  -p 8080:8080 -p 4001:4001 -p 5001:5001 \
  ipfs/go-ipfs:latest