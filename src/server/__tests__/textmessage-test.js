var helper = require('./test-helper');
var textMessage = require('../text_message');

describe('text message tests', function() {

  it('should send to test number', function(done) {
    var m = helper.nock('https://api.plivo.com:443')
      .post('/v1/Account/' + process.env.PLIVO_AUTHID + '/Message/', {"src":process.env.PLIVO_NUMBER,"dst":process.env.TEST_NUMBER,"text":"this is a test","url":process.env.PLIVO_CALLBACK_URL})
      .reply(202, {"api_id":"e150bf3c-818e-11e5-a5c1-22000aXXXXXX","message":"message(s) queued","message_uuid":["8191cede-9a3f-43fa-9ab1-d5851dXXXXXX"]}, { 'content-type': 'application/json',
      date: 'Mon, 02 Nov 2015 18:23:58 GMT',
      server: 'nginx/1.6.2',
      'content-length': '156',
      connection: 'Close' });
    
    return textMessage.send(process.env.TEST_NUMBER, 'this is a test')
      .then(function() {
        return assert.ok(m.isDone());
      }).then(done);
  });

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
