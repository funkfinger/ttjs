var assert = require('chai').assert;
var textMessage = require('../text_message');
var nock = require('nock');

describe('plivo tests', function() {

  // mock requests to Message...
  var mockReq = nock('https://api.plivo.com');
  mockReq.post('/v1/Account/' + process.env.PLIVO_AUTHID + '/Message/').reply(202, "{ api_id: '2195615a-2a6d-11e5-9250-22000ac88fb7',\n  message: 'message(s) queued',\n  message_uuid: [ '6cfd5fa7-c708-4eef-8a77-ce79573b2f94' ] }");

  it('should send message', function() {
    return textMessage.send(16023218695, 'test from test: ' + new Date())
      .then(function(res) {
        return assert.equal(res[0].statusCode, 202);
      });
  });

  it('should have send method', function() {
    assert.isDefined(textMessage.send);
  });

  it('should expose request in textMessage', function() {
    assert.isDefined(textMessage.request);
  });

  it('should have textMessage', function() {
    assert.isDefined(textMessage);
  });

  it('should have request npm installed', function() {
    var request = require('request');
    assert.isDefined(request);
  });
  
});
