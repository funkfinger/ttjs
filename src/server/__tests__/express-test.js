var assert = require('chai').assert;
var app = require('../index.js');
var request = require('supertest');

describe('express acceptance tests', function() {
  
  it('should have basic auth for api', function(done) {
    request(app)
      .get('/api/v1/')
      //.auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASS)
      .expect(401, done)
  });
  
  it('should not have x-header', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function(err, result){
        assert.notProperty(result.header, 'x-powered-by');
        done();
      })
  })
  
  it('should load fb react from cloud (for now)', function(done) {
    request(app)
      .get('/')
      .expect(/react\.js/, done)
  });
  
  it('should be able to serve static files', function(done) {
    request(app)
      .get('/index.html')
      // .expect(/Hello world/)
      .expect(200, done)
  });
  
  it('should have a environment value set to test', function() {
    assert.equal(app.settings.env, 'test', 'app.settings.env: ' + app.settings.env);
  });

  it('should get homepage', function(done) {
  request(app)
    .get('/')
    // .expect(/Hello world/)
    .expect(200, done);
  });
  
});
