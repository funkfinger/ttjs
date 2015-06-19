var assert = require('chai').assert;

describe('sanity tests', function() {
  
  it('should have environment variables set', function() {
    assert.equal(process.env.FOO, 'bar', 'FOO env var is: ' + process.env.FOO);
  });

  it('is sane', function() {
    assert(true);
  });

});