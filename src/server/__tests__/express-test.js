var app = require('../index.js');
var request = require('supertest');

describe('express acceptance tests', function() {
  it('should get homepage', function(done) {
  request(app)
    .get('/')
    .expect(200, done);
  });
});
