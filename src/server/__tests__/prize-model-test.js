var helper = require('./test-helper');
var Prize = db.Prize;

describe('prize model tests', function(done) {

  it('should have a findByIdAnddecrementNumAvail method', function() {
    var p = new Prize({
      name: 'name',
      numAvailable: 1,
      numClaimed: 0,
      imageUrl: 'http://blah.com/image.jpg'
    });
    return p.saveAsync()
      .then(function() {
        return assert.equal(p.numClaimed, 0);
      }).then(function() {
        return Prize.find();
      }).then(function(c) {
        assert.equal(c.length, 1);
      }).then(function() {
        return Prize.findByIdAnddecrementNumAvail(p._id);
      }).then(function() {
        return Prize.findById(p._id).execAsync();
      }).then(function(prize) {
        return assert.equal(prize.numClaimed, 1);
      });
  });

  it('should exist and have name, number available, number claimed', function() {
    var p = new Prize({
      name: 'name',
      numAvailable: 1,
      numClaimed: 0,
      imageUrl: 'http://blah.com/image.jpg'
    });
    assert.equal(p.name, 'name');
    assert.equal(p.numAvailable, 1);
  });
  
});

