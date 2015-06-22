var assert = require('chai').assert;
var Promise = require('bluebird');

describe('sanity tests', function() {
  
  it('should have bluebird promise lib', function(done) {
    var f = function(){};
    var a = new Promise(function(){setTimeout(f, 10)});
    var b = new Promise(function(){setTimeout(done, 5)});;
    fArray = [a, b];
    Promise.join(a, a, a, a, b).then();
  });
  
  it('should have environment variables set', function() {
    assert.equal(process.env.FOO, 'bar', 'FOO env var is: ' + process.env.FOO);
  });

  it('is sane', function() {
    assert(true);
  });

});