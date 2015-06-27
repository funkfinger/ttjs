var helper = require('./test-helper');

var app = require('../index.js');
var request = require('supertest');

// Promise.promisifyAll(request)

var bodyParser = require('body-parser');
var sinon = require('sinon');
var db = require('../db');

var sample = helper.samplePlivoParams;

describe('api express tests', function() {
  
  // it('should call create on phone model', function(done) {
  //   var spy = sinon.spy(db.Phone.create);
  //   console.log('db.Phone.create: ', db.Phone.create)
  //   request(app)
  //     .post('/api/v1/im')
  //     .send(sample)
  //     .expect(200)
  //     .end(function(err, result) {
  //       sinon.assert.called(spy);
  //       done();
  //     });
  // });
    
  it('should have a incoming message endpoint', function(done) {
    request(app)
      .post('/api/v1/im')
      .expect(200)
      .end(function(err, result) {
        done();
      });
  });
  
  it('should have an api endpoint', function(done) {
    request(app)
      .get('/api/v1/')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, result){
        assert.equal(result.body.app_name, 'ttapi');
        assert.equal(result.body.ver, 1);
        done();
      })
  });

});
