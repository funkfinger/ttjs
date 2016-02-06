var helper = require('./test-helper');
var Phone = db.Phone;

var app = require('../index.js');
var request = require('supertest-as-promised');

describe('api tests', function() {

  it('should list keywords as json', function(done) {
    var pg1 = new db.PhoneGroup({keyword: 'kw1'});
    var pg2 = new db.PhoneGroup({keyword: 'kw2'});
    var pg1Id = pg1._id

    return pg1.saveAsync()
      .then(function() {
        return pg2.saveAsync()
      }).then(function() {
        return request(app)
          .get('/admin/keywords.json')
          .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASS)
          // .expect('Content-Type', /application\/json/)
          // .expect(200)
      }).then(function(res) {
        console.log("res.text", res.text);
        assert.match(res.text, /kw1/);
        assert.match(res.text, /kw2/);
        console.log("pg1Id: ", pg1Id);
        // assert.include(res.text, pg1Id);
        done();
      })
    
    
  });

  it('should send send_bulk.html file', function(done) {
    return request(app)
      .get('/admin/send_bulk')
      .expect('Content-Type', /text\/html/)
      .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASS)
      .expect(200)
      .then(function() {
        done();
      });
  });

  it('should send request index file', function() {
    return request(app)
      .get('/admin/requests')
      .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASS)
      .expect('Content-Type', /text\/html/)
      .expect(200)
  });

  it('should list the requests as json', function() {

    helper.nock('https://api.plivo.com:443')
      .post('/v1/Account/' + process.env.PLIVO_AUTHID + '/Message/')
      .reply(202, {"api_id":"764ca697-9ba5-11e5-8e32-22000aXXXXXX","message":"message(s) queued","message_uuid":["24ddb086-723e-4e28-96cf-85bbfcXXXXXX"]});

    helper.nock('https://api.plivo.com:443')
      .post('/v1/Account/' + process.env.PLIVO_AUTHID + '/Message/')
      .reply(202, {"api_id":"764ca697-9ba5-11e5-8e32-22000aXXXXXX","message":"message(s) queued","message_uuid":["24ddb086-723e-4e28-96cf-85bbfcXXXXXX"]});

    var pg = new db.PhoneGroup({keyword: 'request'});

    return pg.saveAsync()
      .then(function() {
        return Phone.handleIncomingMessage({'Text': 'Request prince, erotic city', 'From': 18005551212})
      }).then(function() {
        return Phone.handleIncomingMessage({'Text': 'RequesT got to give it up - gaye', 'From': 18005551213})
      }).then(function() {
        return request(app)
          .get('/admin/requests.json')
          .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASS)
          .expect('Content-Type', /application\/json/)
          .expect(200)
          .then(function(res) {
            assert.match(res.text, /prince\, erotic city/);
            assert.match(res.text, /gaye.*prince/);
            assert.match(res.text, /18005551213/);
            return assert.match(res.text, /got to give it up/);
          });
      });
  });

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
