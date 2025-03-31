// eslint-disable-next-line no-undef
var TenderManagement = artifacts.require('./TenderManagement.sol');
module.exports = function(deployer) {
  deployer.deploy(TenderManagement);
};