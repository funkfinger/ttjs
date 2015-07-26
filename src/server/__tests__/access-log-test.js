var helper = require('./test-helper');
var AccessLog = db.AccessLog;

describe('access log model tests', function(done) {

  it('should exist', function() {
    var al = new AccessLog({data: 'data'});
    assert.equal(al.data, 'data');
  });
  
});

