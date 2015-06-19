var assert = require('chai').assert;
var db = require('../mongo').db;

describe('mongo and mogoose tests', function() {
  it('mogoose should exist', function(done) {
    assert(db);
    done();
  });
});
