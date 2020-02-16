const expect = require("expect.js");
const { createAccount, LocalSigner } = require("orbs-client-sdk");
const { Advice } = require("../src/advice");
const { deployAdvice, getClient } = require("../src/deploy_advice");

describe("Advice", () => {
    xit("updates contract state", async () => {
		const contractOwner = createAccount();
		const contractName = "Advice" + new Date().getTime();

		const signer = new LocalSigner(contractOwner);
		await deployAdvice(getClient(signer), contractName);
		const advice = new Advice(getClient(signer), contractName);
	});
});
