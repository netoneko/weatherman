const { argString, argBytes, argUint64, argUint32 } = require("orbs-client-sdk");

function getErrorFromReceipt(receipt) {
    const value = receipt.outputArguments.length == 0 ? receipt.executionResult : receipt.outputArguments[0].value;
    return new Error(value);
}

class Advice {
	constructor(orbsClient, contractName) {
		this.client = orbsClient;
		this.contractName = contractName;
	}

	async getAdvice(weathermanContractName, hash, hours) {
		const query = await this.client.createQuery(
			this.contractName,
			"getAdvice",
			[
				argString(weathermanContractName),
				argString(hash),
				argUint32(hours)
			]
		);

		const receipt = await this.client.sendQuery(query);
		if (receipt.executionResult !== 'SUCCESS') {
			throw getErrorFromReceipt(receipt);
		}

		return receipt.outputArguments[0].value;
	}
}

module.exports = {
	Advice
};
