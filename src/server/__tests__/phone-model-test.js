var utils = require('./utils');
var Phone = require('../models/phone');

describe('phone model tests', function() {
  
  beforeEach(function(done){
    for (var i in mongoose.connection.collections) {
       mongoose.connection.collections[i].remove(function() {});
    }
    done();
  });
  
  afterEach(function(done){
    mongoose.models = {};
    mongoose.modelSchemas = {};
    done();
  });

  it('should be able to save', function() {
    assert.equal(Phone.count({}, function(err, count){}), 0);
    var n = new Phone({number: 9999999999});
    n.save(function(err) {
      if (err) {
        console.log(err);
        assert(false)
      }
      else {
        assert(true);
      };
    });
  });
  
  it('should have a number', function() {
    var n = new Phone({number: 9999999999});
    assert(n);
  });
  
  it('should exist as a model', function() {
    assert(Phone);
  });
  
});