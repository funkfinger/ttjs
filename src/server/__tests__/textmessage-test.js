var helper = require('./test-helper');
var Phone = db.Phone;
var textMessage = require('../text_message');
var nock = require('nock');

describe('text message tests', function() {

  var mockReq = function() {
    var m = nock('https://api.plivo.com');
    m.post('/v1/Account/' + process.env.PLIVO_AUTHID + '/Message/').reply(202, "{ api_id: '2195615a-2a6d-11e5-9250-22000ac88fb7',\n  message: 'message(s) queued',\n  message_uuid: [ '6cfd5fa7-c708-4eef-8a77-ce79573b2f94' ] }");
    return m;
  }

  // it('should add uuid to Phone model', function() {
  //   mockReq();
  //   var p = new Phone({number: 11});
  //   return p.saveAsync()
  //     .then(function() {
  //       return textMessage.send(16023218695, 'test from test: ' + new Date());
  //     }).then(function() {
  //       return Phone.findOne({number: 11}).execAsync();
  //     }).then(function(p) {
  //       assert.equal(p.outgoingMessages.length, 1);
  //       assert.equal(p.outgoingMessages[0].uuid, '6cfd5fa7-c708-4eef-8a77-ce79573b2f94');
  //     });
  // });

  it('should send message', function() {
    var m = mockReq();
    var p = new Phone({number: 555});
    return p.saveAsync()
      .then(function(p) {
        return textMessage.send(p[0].number, 'test from test: ' + new Date());
      }).then(function(res) {
        console.log('res: ', res);
        assert.ok(m.isDone());
      })
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
