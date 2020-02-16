const { argString, argBytes, argUint64, argUint32 } = require("orbs-client-sdk");
const { map } = require("lodash");

function getErrorFromReceipt(receipt) {
    const value = receipt.outputArguments.length == 0 ? receipt.executionResult : receipt.outputArguments[0].value;
    return new Error(value);
}

class Weatherman {
	constructor(orbsClient, contractName) {
		this.client = orbsClient;
		this.contractName = contractName;
	}

	async updateDatasource(hash) {
		const [ tx, txId ] = await this.client.createTransaction(
			this.contractName,
			"updateDatasource",
			[
				argString(hash)
			]
		);

		const receipt = await this.client.sendTransaction(tx);
		if (receipt.executionResult !== 'SUCCESS') {
			throw getErrorFromReceipt(receipt);
		}
	}

	async getDatasource() {
		const query = await this.client.createQuery(
			this.contractName,
			"getDatasource",
			[]
		);

		const receipt = await this.client.sendQuery(query);
		if (receipt.executionResult !== 'SUCCESS') {
			throw getErrorFromReceipt(receipt);
		}

		return map(receipt.outputArguments, "value");
	}

	async getWeather(hash, hours) {
		const query = await this.client.createQuery(
			this.contractName,
			"getWeather",
			[
				argString(hash),
				argUint32(hours)
			]
		);

		const receipt = await this.client.sendQuery(query);
		if (receipt.executionResult !== 'SUCCESS') {
			throw getErrorFromReceipt(receipt);
		}

		return JSON.parse(receipt.outputArguments[0].value);
	}
}

module.exports = {
	Weatherman
};
