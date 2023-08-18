const DataVault = artifacts.require("DataVault");

module.exports = function(deployer) {
  deployer.deploy(DataVault, "1.0"); // The argument "1.0" is an example if your constructor expects a version.
};