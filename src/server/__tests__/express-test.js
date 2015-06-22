var assert = require('chai').assert;
var app = require('../index.js');
var request = require('supertest');

describe('express acceptance tests', function() {
  
  it('should have a environment value set to test', function() {
    assert.equal(app.settings.env, 'test', 'app.settings.env: ' + app.settings.env);
  });

  it('should get homepage', function(done) {
  request(app)
    .get('/')
    .expect(/Hello World/)
    .expect(200, done);
  });
  
});
