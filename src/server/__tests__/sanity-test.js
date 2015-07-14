var chai = require('chai');
var assert = chai.assert;
var helper = require('./test-helper');

describe('sanity tests', function() {
  
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