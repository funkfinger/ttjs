var helper = require('./test-helper');
var AccessLog = db.AccessLog;

describe('access log model tests', function(done) {

  it('should have a created and updated at date', function() {
    var al = new AccessLog({data: 'data'})
    return al.saveAsync()
      .then(function(newAl){
        assert.ok(newAl[0].createdAt);
        assert.ok(newAl[0].updatedAt);
        return assert.equal(newAl[0].createdAt, newAl[0].updatedAt);
      })
  });

  it('should exist', function() {
    var al = new AccessLog({data: 'data'});
    assert.equal(al.data, 'data');
  });
  
});

