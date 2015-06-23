var assert = require('chai').assert;
var app = require('../index.js');
var request = require('supertest');
var bodyParser = require('body-parser')

describe('api express tests', function() {
  
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
