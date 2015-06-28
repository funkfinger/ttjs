var helper = require('./test-helper');

var app = require('../index.js');
// var request = require('supertest');
var request = require('supertest-as-promised');

var bodyParser = require('body-parser');
var sinon = require('sinon');
// var db = require('../db');

// db.Phone.handleIncomingMessage = function() {console.log('got here!!!')}

var sample = helper.samplePlivoParams;

describe('api express tests', function() {

  it('should create a phone entry when a post is made to im', function() {
    return request(app)
      .post('/api/v1/im')
      .send(sample)
      .expect(200)
      .then(function() {
        return db.Phone.count();
      }).then(function(c){
        assert.equal(c, 1, 'should be created')
      })
  });
  
  // i can't get spys working, not sure i need to, but it would probably be nice...
  // it('should call handleIncomingMessage on phone model', function() {
  //   // var spy = sinon.spy(db.Phone, 'handleIncomingMessage');
  //   // sinon.assert.called(spy);
  //   return request(app)
  //     .post('/api/v1/im')
  //     .send(sample)
  //     .expect(200)
  //     .then(function(){
  //       // assert.ok(spy.called);
  //     })
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
