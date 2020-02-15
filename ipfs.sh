#!/bin/bash

### DOES NOT WORK

rm -rf .ipfs

export HOME=.
ipfs init
ipfs daemon &
ipfs config Addresses.Gateway /ip4/0.0.0.0/tcp/9001

kill $!

ipfs daemon