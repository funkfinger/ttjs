var helper = require('./test-helper');
var Prize = db.Prize;

describe('prize model tests', function(done) {

  it('should exist and have name, number available, number claimed', function() {
    var p = new Prize({
      name: 'name',
      numAvailable: 1,
      numClaimed: 0
    });
    assert.equal(p.name, 'name');
    assert.equal(p.numAvailable, 1);
  });
  
});

