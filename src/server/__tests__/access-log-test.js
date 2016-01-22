var helper = require('./test-helper');
var AccessLog = db.AccessLog;
var request = require('supertest-as-promised');
var app = require('../index.js');


describe('access log model tests', function(done) {
  
  // it('should create entry on access of api', function() {
  //   request(app)
  //     .get('/api/v1/testsms')
  //     .expect(201)
  //     .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASS);
  // });

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
    return assert.equal(al.data, 'data');
  });
  
});

