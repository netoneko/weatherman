const { argString, argBytes, argUint64, argUint32 } = require("orbs-client-sdk");

function getErrorFromReceipt(receipt) {
    const value = receipt.outputArguments.length == 0 ? receipt.executionResult : receipt.outputArguments[0].value;
    return new Error(value);
}

class Weatherman {
	constructor(orbsClient, contractName) {
		this.client = orbsClient;
		this.contractName = contractName;
	}

	async add(n) {
		const [ tx, txId ] = await this.client.createTransaction(
			this.contractName,
			"add",
			[
				argUint64(n)
			]
		);

		const receipt = await this.client.sendTransaction(tx);
		if (receipt.executionResult !== 'SUCCESS') {
			throw getErrorFromReceipt(receipt);
		}

		return receipt.outputArguments[0].value;
	}

	async value() {
		const query = await this.client.createQuery(
			this.contractName,
			"value",
			[]
		);

		const receipt = await this.client.sendQuery(query);
		if (receipt.executionResult !== 'SUCCESS') {
			throw getErrorFromReceipt(receipt);
		}

		return receipt.outputArguments[0].value;
	}

	async weather(hash, hours) {
		const query = await this.client.createQuery(
			this.contractName,
			"weather",
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
