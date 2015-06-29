var helper = require('./test-helper');

var app = require('../index.js');
var request = require('supertest-as-promised');

var bodyParser = require('body-parser');
var sinon = require('sinon');

var sample = helper.samplePlivoParams;

describe('api tests', function() {

  it('should create one phone and multiple incoming messages when incoming meesage is called', function() {
    return request(app).post('/api/v1/im').send(sample)
      .then(function() {
        return request(app).post('/api/v1/im').send(sample)
      }).then(function() {
        return request(app).post('/api/v1/im').send(sample)
      }).then(function() {
        return db.Phone.count();
      }).then(function(c) {
        assert.equal(c, 1, 'should only be one');
      }).then(function() {
        return db.Phone.findOne({}).exec();
      }).then(function(p) {
        assert.equal(p.incomingMessages.length, 3, 'should have 3 incoming messages');
      });
  });

  it('should create a phone entry when a post is made to im', function() {
    return request(app).post('/api/v1/im').send(sample)
    .expect(200)
    .then(function(){
        return db.Phone.count();
      }).then(function(c) {
        assert.equal(c, 1, 'should create a phone record and therefore count should equal 1');
      });
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
