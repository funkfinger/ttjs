var helper = require('./test-helper');
var PhoneGroup = db.PhoneGroup;
var Phone = db.Phone;

describe('phone group model tests', function(done) {
  
  it('should not add multiple same phones to a group', function() {

    var toNum = 18005551212;
    var message = process.env.GENERIC_TEXT_RESPONSE;
    var kw = 'grp';

    ph = new Phone({number: toNum});
    pg = new PhoneGroup({keyword: kw});

    return ph.saveAsync()
      .then(function() {
        return pg.saveAsync();
      }).then(function() {
        var nock = helper.nock('https://api.plivo.com:443')
          .post('/v1/Account/' + process.env.PLIVO_AUTHID + '/Message/', {"src":process.env.PLIVO_NUMBER,"dst":toNum,"text":message,"url":process.env.PLIVO_CALLBACK_URL})
          .reply(202, {"api_id":"34489f3c-34f0-11e5-bfa2-22000afaa73b","message":"message(s) queued","message_uuid":["a1d67e58-f35a-47da-ab0b-5d1cd06a8d32"]}, { 'content-type': 'application/json',
          date: 'Tue, 28 Jul 2015 06:16:37 GMT',
          server: 'nginx/1.8.0',
          connection: 'Close' });

        PhoneGroup.findKeywordAndAddToGroup(kw, ph);

        var nock = helper.nock('https://api.plivo.com:443')
          .post('/v1/Account/' + process.env.PLIVO_AUTHID + '/Message/', {"src":process.env.PLIVO_NUMBER,"dst":toNum,"text":message,"url":process.env.PLIVO_CALLBACK_URL})
          .reply(202, {"api_id":"34489f3c-34f0-11e5-bfa2-22000afaa73b","message":"message(s) queued","message_uuid":["a1d67e58-f35a-47da-ab0b-5d1cd06a8d32"]}, { 'content-type': 'application/json',
          date: 'Tue, 28 Jul 2015 06:16:37 GMT',
          server: 'nginx/1.8.0',
          connection: 'Close' });

        return PhoneGroup.findKeywordAndAddToGroup(kw, ph);
    
      }).then(function() {
        return PhoneGroup.findById(pg._id).execAsync()
      }).then(function(pgNew) {
        console.log('pgNew', pgNew);
        return assert.equal(pgNew.phones.length, 1);
      })
  })
  
  it('should be able to send messages to group', function() {
    
    var toNum1 = 18005551212;
    
    var nock1 = helper.nock('https://api.plivo.com:443')
      .post('/v1/Account/' + process.env.PLIVO_AUTHID + '/Message/', {"src":process.env.PLIVO_NUMBER,"dst":toNum1,"text":"group_message","url":process.env.PLIVO_CALLBACK_URL})
      .reply(202, {"api_id":"34489f3c-34f0-11e5-bfa2-22000afaa73b","message":"message(s) queued","message_uuid":["a1d67e58-f35a-47da-ab0b-5d1cd06a8d32"]}, { 'content-type': 'application/json',
      date: 'Tue, 28 Jul 2015 06:16:37 GMT',
      server: 'nginx/1.8.0',
    connection: 'Close' });

    var toNum2 = 18005551222;
      
    var nock2 = helper.nock('https://api.plivo.com:443')
      .post('/v1/Account/' + process.env.PLIVO_AUTHID + '/Message/', {"src":process.env.PLIVO_NUMBER,"dst":toNum2,"text":"group_message","url":process.env.PLIVO_CALLBACK_URL})
      .reply(202, {"api_id":"3449fe68-34f0-11e5-a541-22000aXXXXXX","message":"message(s) queued","message_uuid":["0579a9bb-02f6-48c8-aee6-1cb2c2XXXXXX"]}, { 'content-type': 'application/json',
      date: 'Tue, 28 Jul 2015 06:16:37 GMT',
      server: 'nginx/1.8.0',
      connection: 'Close' });
      
      
    ph1 = new Phone({number: toNum1});
    assert.ok(ph1.save());
    ph2 = new Phone({number: toNum2});
    assert.ok(ph2.save());
    pg = new PhoneGroup({keyword: 'group'});
    pg.phones.push(ph1);
    pg.phones.push(ph2);
    return pg.saveAsync()
      .then(function() {
        return pg.sendMessage('group_message');
      }).then(function() {
        return Phone.findById(ph1._id).populate('outgoingMessages');
      }).then(function(p) {
        assert.equal(p.outgoingMessages.length, 1);
        return assert.equal(p.outgoingMessages[0].body, 'group_message');
      });
  });

  it('should have signup text response text', function() {
    pg = new PhoneGroup({keyword: 'signup', signupResponse: 'welcome you'});
    return pg.saveAsync()
      .then(function() {
        return assert.equal(pg.signupResponse, 'welcome you');
      })
  });

  it('should be case insensitive (downcase)', function() {
    pg = new PhoneGroup({keyword: 'CaSe'});
    return pg.save()
      .then(function() {
        assert.equal(pg.keyword, 'case');
      })
  });
  
  it('phone group should have a keyword', function() {
    pg = new PhoneGroup({keyword: 'keyw'});
    return pg.save()
      .then(function() {
        assert.equal(pg.keyword, 'keyw');
      });
  });

  it('should exist and have an array of phone ids', function() {
    var phone = new Phone({number: 18005551212});
    assert.ok(phone.save());
    var phoneGroup = new PhoneGroup({keyword: 'kw'});
    phoneGroup.phones.push(phone);
    var pgid = phoneGroup.id;
    return phoneGroup.save()
      .then(function() {
        return PhoneGroup.findById(pgid).populate('phones').execAsync()
      }).then(function(pg) {
        assert.equal(1, pg.phones.length);
        assert.equal(18005551212, pg.phones[0].number)
      })
  });
  
});
