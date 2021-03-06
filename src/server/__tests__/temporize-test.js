var helper = require('./test-helper');
var temporize = require('../temporize');
var request = require('supertest-as-promised');
var rp = require('request-promise');

request = request(process.env.TEMPORIZE_URL);

describe('temporize tests', function() {

  it('should have moment-timezone', function() {    
    return assert.ok(temporize.moment.tz.names());
  });

  it('should have moment.js and can format for temporize', function() {
    d = temporize.moment([2015, 10, 3, 1, 15]);
    return assert.equal(temporize.formatForTemporize(d), '20151103T011500Z', d);
    // return assert.equal(temporize.formatForTemporize(d), '20151103T081500Z', d);
  });

  it('should schedule someting through temporize module', function() {
    
    var n = helper.nock(process.env.TEMPORIZE_URL)
      .post('/v1/events/20151103T011500Z/http%3A%2F%2Fgoogle.com') // what showes up on codeship
      //.post('/v1/events/20151108T153000Z/http%3A%2F%2Fgoogle.com') // whoat shows up on local machine...
      .reply(200);

    temporize.schedule(temporize.moment([2015, 10, 3, 1, 15]), 'http://google.com')
      .then(function(t) {
        console.log(t);
        return assert.ok(n.isDone());
      });
  })
  

  it('should be able to schedule something with temporize', function() {
    
    helper.nock(process.env.TEMPORIZE_URL)
      .post('/v1/events/20151107T010000Z/http%3A%2F%2Fgoogle.com')
      .reply(200, {"id":"xxx","account":"xxx","user":"xxx","status":"Active","url":"http://google.com","data":"","when":"2015-11-07T08:00:00.000Z"}, { server: 'nginx/1.4.6 (Ubuntu)',
      date: 'Sun, 01 Nov 2015 12:18:28 GMT',
      'content-type': 'application/json; charset=utf-8',
      connection: 'close' });
        
    var time = new Date(2015,10,7);
    time.setUTCHours(1);
    var timeString = time.toISOString().replace(/\.\d+/,'').replace(/\:/g,'').replace(/\-/g,'');
    var date =  timeString;
    var callbackUrl = encodeURIComponent('http://google.com');
    var url = process.env.TEMPORIZE_URL + '/v1/events/' + date + '/' + callbackUrl;
    
    return rp.post({uri: url, resolveWithFullResponse: true})
      .then(function(r) {
        return assert.equal(r.statusCode, 200);
      });
  });
  
  it('should be able to access temporize api', function() {
    
    helper.nock(process.env.TEMPORIZE_URL)
      .get('/v1/auth')
      .reply(200, "", { server: 'nginx/1.4.6 (Ubuntu)',
      date: 'Sun, 01 Nov 2015 10:31:11 GMT',
      'content-length': '0',
      connection: 'close' });
    
    var url = '/v1/auth';
    return request.get(url)
      .then(function(r){
        assert.ok(true);
        return assert.equal(r.status, 200);
      });
  });
  
  it('should have temporize url set', function() {
    assert.ok(process.env.TEMPORIZE_URL);
  })
  
  it('should have temporize', function() {
    assert.isDefined(temporize);
  });
});