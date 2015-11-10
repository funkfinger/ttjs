var chai = require('chai');
var assert = chai.assert;
var helper = require('./test-helper');

describe('sanity tests', function() {
  
  it('should be able to create event', function(done) {
    var EventEmitter = require("events").EventEmitter;
    var e = new EventEmitter();
    e.on('myEvent', function() {done();}.bind(this));
    e.emit('myEvent');
  });
  
  it('should have unsubscribe message set in env', function() {
    assert.ok(process.env.UNSUB_MESSAGE);
  });
  
  it('should use spies', function() {
    var sendMessage = sinon.spy();
    sendMessage();
    assert.ok(sendMessage.called);
  });
  
  it('should have a test helper', function(){
    assert.isTrue(helper.exists);
  });
    
  it('should have environment variables set', function() {
    assert.equal(process.env.FOO, 'bar', 'FOO env var is: ' + process.env.FOO);
  });

  it('is sane', function() {
    assert(true);
  });

});