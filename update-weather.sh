#!/bin/bash

curl -L -s https://api.weather.gov/gridpoints/BOU/62,61/forecast/hourly?units=si > weather.json
ipfs block put weather.json
