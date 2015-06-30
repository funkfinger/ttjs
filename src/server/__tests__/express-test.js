var assert = require('chai').assert;
var app = require('../index.js');
var request = require('supertest');

describe('express acceptance tests', function() {
  
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
