var helper = require('./test-helper');
var Prize = db.Prize;

describe('prize model tests', function(done) {

  it('should have an active flag on prizes', function() {
    var p = new Prize({
      name: 'prize name',
      numAvailable: 1,
      numClaimed: 0,
      imageUrl: 'http://blah.com/image.jpg'
    });
    return p.save()
      .then(function() {
        return Prize.findById(p._id);
      }).then(function(prize) {
        return assert.ok(prize.active);
    });
  });


  it('should have num remaining as math on num avail - num claimed', function(){
    var p = new Prize({
      name: 'num remaining',
      numAvailable: 2,
      numClaimed: 0,
      imageUrl: 'http://blah.com/image.jpg'      
    });
    return p.save()
      .then(function() {
        return Prize.findById(p._id);
      }).then(function(prize) {
        assert.equal(prize.numRemaining, 2);
        prize.numClaimed = 1;
        return prize.save();
      }).then(function() {
        return Prize.findById(p._id);
      }).then(function(prize) {
        return assert.equal(prize.numRemaining, 1);
      });
  });

  it('should have a findByIdAndDecrementNumAvail method', function() {
    var p = new Prize({
      name: 'name',
      numAvailable: 1,
      numClaimed: 0,
      imageUrl: 'http://blah.com/image.jpg'
    });
    return p.save()
      .then(function() {
        return assert.equal(p.numClaimed, 0);
      }).then(function() {
        return Prize.find();
      }).then(function(c) {
        assert.equal(c.length, 1);
      }).then(function() {
        return Prize.findByIdAndDecrementNumAvail(p._id);
      }).then(function() {
        return Prize.findById(p._id).exec();
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

