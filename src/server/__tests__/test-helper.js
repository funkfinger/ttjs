var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

global.Promise = require('bluebird');
global.assert = chai.assert;

var helper = module.exports = {};

helper.exists = true;

helper.samplePlivoParams = {
  "From": "18005551212",
  "TotalRate": "0.00000",
  "Text": "SmS TeXt",
  "To": "18005551313",
  "Units": "1",
  "TotalAmount": "0.00000",
  "Type": "sms",
  "MessageUUID": "d709da80-7dc4-11e4-a77d-22000ae383ea"
};