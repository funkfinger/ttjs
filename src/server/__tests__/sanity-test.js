var assert = require('chai').assert;
var Promise = require('bluebird');

describe('sanity tests', function() {
    
  it('should have environment variables set', function() {
    assert.equal(process.env.FOO, 'bar', 'FOO env var is: ' + process.env.FOO);
  });

  it('is sane', function() {
    assert(true);
  });

});