const fetch = require("node-fetch");
const express = require("express");
const ipfsClient = require('ipfs-http-client')
const { getClient, getWeathermanContractName } = require("./deploy_weatherman");
const { createAccount, LocalSigner } = require("orbs-client-sdk");
const { Weatherman } = require("./weatherman");

const PORT = process.env.PORT || 3000;
const IPFS_ENDPOINT = process.env.IPFS_ENDPOINT || "http://localhost:5001";

let updatedAt;
let hash;

async function update() {
    try {
        const data = await fetch("https://api.weather.gov/gridpoints/BOU/62,61/forecast/hourly?units=si");
        const weather = await data.buffer();

        const ipfs = ipfsClient(IPFS_ENDPOINT);
        const block = await ipfs.block.put(weather);

        hash = block.cid.toString();
        updatedAt = new Date();

        console.log(hash, updatedAt);

        const signer = new LocalSigner(createAccount());
        const weatherman = new Weatherman(getClient(signer), getWeathermanContractName());
        await weatherman.updateDatasource(hash);
    } catch(e) {
        console.error(e);
    }
}

update();
const _10m = 600000;
setInterval(update, _10m);

const app = express();
app.get('/', (req, res) => res.send({
    status: "OK",
    description: "EthDenver hackathon weather oracle",
    datasource: {
        hash,
        updatedAt
    }
}));

app.listen(PORT, () => console.log(`Oracale app listening on port ${PORT}!`))

