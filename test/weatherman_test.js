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

		const [defaultHash, defaultTimestamp] = await weatherman.getDatasource();
		expect(defaultHash).to.be.eql("");
		expect(defaultTimestamp).to.be.eql(0);

		await weatherman.updateDatasource("QmeQv9kHWefgfcGstg2TBZZuQA2FCC1r2Co8fh1QWQSYMa");
		const [updatedHash, updatedTimestamp] = await weatherman.getDatasource();
		expect(updatedHash).to.be.eql("QmeQv9kHWefgfcGstg2TBZZuQA2FCC1r2Co8fh1QWQSYMa");
	});

	it("pulls weather info", async () => {
		const contractOwner = createAccount();
		const contractName = "Weatherman" + new Date().getTime();

		const signer = new LocalSigner(contractOwner);
		await deployWeatherman(getClient(signer), contractName);
		const weatherman = new Weatherman(getClient(signer), contractName);

		const defaultValue = await weatherman.getWeather("QmeQv9kHWefgfcGstg2TBZZuQA2FCC1r2Co8fh1QWQSYMa", 24);
		expect(Object.keys(defaultValue).length).to.be.eql(24);
	});
});
