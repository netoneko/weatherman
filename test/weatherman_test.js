const expect = require("expect.js");
const { createAccount, LocalSigner } = require("orbs-client-sdk");
const { Weatherman } = require("../src/weatherman");
const { deployWeatherman, getClient } = require("../src/deploy_weatherman");

describe("Weatherman", () => {
    it("updates contract state", async () => {
		const contractOwner = createAccount();
		const contractName = "Weatherman" + new Date().getTime();

		const signer = new LocalSigner(contractOwner);
		await deployWeatherman(getClient(signer), contractName);
		const weatherman = new Weatherman(getClient(signer), contractName);

		const defaultValue = await weatherman.value();
		expect(defaultValue).to.be.eql(0);

		const updatedValue = await weatherman.add(7);
		expect(updatedValue).to.be.eql(7);
	});

	it("pulls weather info", async () => {
		const contractOwner = createAccount();
		const contractName = "Weatherman" + new Date().getTime();

		const signer = new LocalSigner(contractOwner);
		await deployWeatherman(getClient(signer), contractName);
		const weatherman = new Weatherman(getClient(signer), contractName);

		const defaultValue = await weatherman.weather("QmeQv9kHWefgfcGstg2TBZZuQA2FCC1r2Co8fh1QWQSYMa", 24);
		expect(Object.keys(defaultValue).length).to.be.eql(2);
	});
});
