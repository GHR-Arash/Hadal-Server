const DataVault = artifacts.require("DataVault");
const { expect } = require("chai");

contract("DataVault", (accounts) => {
    let dataVault;
    const owner = accounts[0];
    const newOwner = accounts[1];
    const nonOwner = accounts[2];
    const initialVersion = "1.0.0";
    const updatedVersion = "1.1.0";

    beforeEach(async () => {
        // dataVault = await DataVault.new(initialVersion, { from: owner });
        dataVault = await DataVault.new(initialVersion, { from: owner });
    });

    it("should get the deployed contract address", async () => {
        const dataVaultInstance = await DataVault.deployed();
        console.log("Deployed contract address:", dataVaultInstance.address);
    });

    it("should set the correct owner and version during deployment", async () => {
        const contractOwner = await dataVault.owner();
        const contractVersion = await dataVault.version();

        expect(contractOwner).to.equal(owner);
        expect(contractVersion).to.equal(initialVersion);
    });

    it("should allow the owner to set a value", async () => {
        const key = "testKey";
        const value = "testValue";

        const receipt = await dataVault.setValue(key, value, { from: owner });
        expect(receipt.logs[0].event).to.equal("ValueSet");
        expect(receipt.logs[0].args.key).to.equal(key);
        expect(receipt.logs[0].args.value).to.equal(value);

        const storedValue = await dataVault.getValue(key);
        expect(storedValue).to.equal(value);
    });

    it("should not allow non-owners to set a value", async () => {
        try {
            await dataVault.setValue("testKey", "testValue", { from: nonOwner });
            assert.fail("Expected revert not received");
        } catch (error) {
            const errorMessage = error.reason || error.message;
            expect(errorMessage).to.include("Not the contract owner");
        }
    });

    it("should allow the owner to retrieve the value for a given key", async () => {
        const key = "testKey";
        const value = "testValue";
        await dataVault.setValue(key, value, { from: owner });
        const retrievedValue = await dataVault.getValue(key, { from: owner });
        expect(retrievedValue).to.equal(value);
    });

    it("should not allow non-owners to retrieve the value", async () => {
        try {
            const key = "testKey";
            await dataVault.getValue(key, { from: nonOwner });
            assert.fail("Expected revert not received");
        } catch (error) {
            const errorMessage = error.reason || error.message;
            expect(errorMessage).to.include("Not the contract owner");
        }
    });

    it("should allow the owner to change the contract's owner", async () => {
        await dataVault.changeOwner(newOwner, { from: owner });
        const contractOwner = await dataVault.owner();
        expect(contractOwner).to.equal(newOwner);
    });

    it("should allow the owner to update the contract's version", async () => {
        await dataVault.updateVersion(updatedVersion, { from: owner });
        const contractVersion = await dataVault.version();
        expect(contractVersion).to.equal(updatedVersion);
    });
});

