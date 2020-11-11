# weatherman

Oracle that sources data from US government weather service.

I have modified the Orbs node and SDK to include a call that allows to read files from IPFS. IPFS is an open source distributed file system which references the content by hash. This means that if you access a certain file, it will always be the same file, and your network will be able to reach the consensus.

## Architecture

* The external worker that reads data from US weather service and deposits it to ipfs and sends a transaction to the Weatherman smart contract to point it to a new data source
* The Weatherman smart contract that reads JSON from IPFS and transforms it into a better format (GEOJSON is pretty bulky)
* The Advice contract that calls the Weatherman contract, calculates average temperature for the next 12 hours and suggests what you should wear according to the calculation
* Static HTML page hosted on GitHub that talks to the Weatherman contract and to the Advice contract and displays the data
