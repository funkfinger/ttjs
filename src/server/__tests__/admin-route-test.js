var helper = require('./test-helper');

var app = require('../index.js');
var request = require('supertest-as-promised');

describe('api tests', function() {


  it.only('should have admin page', function(done) {
    request(app)
      .get('/admin/')
      .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASS)
      .expect('Content-Type', /text\/html/)
      .expect(200, done);
  });
});
