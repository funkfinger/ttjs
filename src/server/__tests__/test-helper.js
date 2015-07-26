var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

global.Promise = require('bluebird');
global.assert = chai.assert;

var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.use(sinonChai);

global.sinon = sinon;
global.expect = chai.expect;

var nock = require('nock');

var helper = module.exports = {};

helper.nock = nock;
//nock.recorder.rec();

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

require('./db-helper.js');

helper.mockReq = function() {
  var m = nock('https://api.plivo.com');
  m.post('/v1/Account/' + process.env.PLIVO_AUTHID + '/Message/').reply(202, "{ api_id: '2195615a-2a6d-11e5-9250-22000ac88fb7',\n  message: 'message(s) queued',\n  message_uuid: [ '6cfd5fa7-c708-4eef-8a77-ce79573b2f94' ] }");
  return m;
}
