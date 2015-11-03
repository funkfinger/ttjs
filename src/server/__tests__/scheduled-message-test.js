var helper = require('./test-helper');
var ScheduledMessage = db.ScheduledMessage;
var PhoneGroup = db.PhoneGroup;
var Phone = db.Phone;

describe('scheduled message tests', function() {
    
  it('should set state to sent and send when sendMessage', function() {
    var kw = 'blah';
    var toNum = 18005551212;
    var message = 'message here...';
    var sm = new ScheduledMessage({state: 'scheduled', keyword: kw, message: message});
    var pg = new PhoneGroup({keyword: kw, });
    var ph = new Phone({number: toNum});

    var nock = helper.nock('https://api.plivo.com:443')
      .post('/v1/Account/' + process.env.PLIVO_AUTHID + '/Message/', {"src":process.env.PLIVO_NUMBER,"dst":toNum,"text":message,"url":process.env.PLIVO_CALLBACK_URL})
      .reply(202, {"api_id":"34489f3c-34f0-11e5-bfa2-22000axxxxxx","message":"message(s) queued","message_uuid":["a1d67e58-f35a-47da-ab0b-5d1cd0xxxxxx"]}, { 'content-type': 'application/json',
        date: 'Tue, 28 Jul 2015 06:16:37 GMT',
        server: 'nginx/1.8.0',
        connection: 'Close'
    });
    
    return sm.saveAsync()
      .then(function() {
        return ph.saveAsync();
      }).then(function() {
        pg.phones.addToSet(ph._id);
        return pg.saveAsync();
      }).then(function() {
        return sm.sendMessage();
      }).then(function() {
        assert.ok(nock.isDone());
        return assert.equal(sm.state, 'sent');
      });
  });

  it('should exist and have a state and keyword and message', function() {
    var sm = new ScheduledMessage({state: 'scheduled', keyword: 'blah', message: 'message here...'});
    assert.ok(sm.save);
    assert.equal(sm.state, 'scheduled');
    assert.equal(sm.keyword, 'blah');
    assert.equal(sm.message, 'message here...');
  });
  
});
