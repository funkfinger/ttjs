var helper = require('./test-helper');
var textMessage = require('../text_message');

describe('text message tests', function() {


  it('should have callback on send message', function(done) {
    var m = helper.mockReq();
    var cb = function(res) {assert.equal(res[0].statusCode, 202); done();};
    textMessage.send(666, 'test from test 2', cb);
  });

  it('should send message', function(done) {
    var m = helper.mockReq();
    textMessage.send(555, 'test from test: ' + new Date())
      .then(function(res) {
        assert.equal(res[0].statusCode, 202);
        assert.ok(m.isDone());
        done();
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
