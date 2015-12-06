var helper = require('./test-helper');
var Phone = db.Phone;

var app = require('../index.js');
var request = require('supertest-as-promised');

describe('api tests', function() {

  // it('should list the requests', function() {
  //
  //   helper.nock('https://api.plivo.com:443')
  //     .post('/v1/Account/' + process.env.PLIVO_AUTHID + '/Message/')
  //     .reply(202, {"api_id":"764ca697-9ba5-11e5-8e32-22000aXXXXXX","message":"message(s) queued","message_uuid":["24ddb086-723e-4e28-96cf-85bbfcXXXXXX"]});
  //
  //   var pg = new db.PhoneGroup({keyword: 'request'});
  //
  //   return pg.saveAsync()
  //     .then(function() {
  //       return Phone.handleIncomingMessage({'Text': 'request prince, erotic city', 'From': 18005551212})
  //     }).then(function() {
  //       return request(app)
  //         .get('/admin/requests')
  //         .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASS)
  //         .expect('Content-Type', /text\/html/)
  //         .expect(200)
  //         .then(function(res) {
  //           assert.match(res.text, /prince\, erotic city/);
  //         });
  //     });
  // });

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
