var helper = require('./test-helper');

var app = require('../index.js');
var request = require('supertest-as-promised');

describe('api tests', function() {

  it('should have admin page', function() {
    return request(app)
      .get('/admin/')
      .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASS)
      .expect('Content-Type', /text\/html/)
      .expect(200)
      .then(function(res) {
        assert.match(res.text, /Tongue Tied ADMIN/);
      });
  });
  
});
