const DatteRegistry = artifacts.require("DatteRegistry");

module.exports = function (deployer) {
  deployer.deploy(DatteRegistry);
};
