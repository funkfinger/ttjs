var helper = require('./test-helper');
var Phone = db.Phone;
var IncomingMessage = db.IncomingMessage;
var OutgoingMessage = db.OutgoingMessage;

var toNum = 18005551212


describe('phone model tests', function(done) {

  it('should be able to add self to group', function(done) {
    pg = new db.PhoneGroup({keyword: 'kw'});
    p = new Phone({number: 18005551212});
    pg.save()
      .then(function (){
        return p.save();
    }).then(function() {
      return db.PhoneGroup.findById(pg._id).exec()
    }).then(function(pg1) {
      pg = pg1;
      return assert.equal(pg.phones.length, 0);
    }).then(function() {
      return p.addToGroup(pg);
    }).then(function() {
      return db.PhoneGroup.findById(pg._id).exec()
    }).then(function(pg1) {
      pg = pg1;
      return assert.equal(pg.phones.length, 1);
    }).then(function() {
      return p.addToGroup(pg);
    }).then(function() {
      return db.PhoneGroup.findById(pg._id).exec()
    }).then(function(pg1) {
      pg = pg1;
      return assert.equal(pg.phones.length, 1);
    }).then(done);
  })

  it('should send help message upon help keyword', function(done) { // TODO: move this to somewhere else - not a phone issue now?...
    
    var m = helper.nock('https://api.plivo.com:443')
      .post('/v1/Account/' + process.env.PLIVO_AUTHID + '/Message/', {"src":process.env.PLIVO_NUMBER,"dst":toNum,"text":process.env.HELP_MESSAGE,"url":process.env.PLIVO_CALLBACK_URL})
      .reply(202, {"api_id":"caf37bd6-4572-11e5-bfa2-22000aXXXXXX","message":"message(s) queued","message_uuid":["fbf30c47-e717-4eba-8041-cefc93XXXXXX"]}, { 'content-type': 'application/json',
      date: 'Tue, 18 Aug 2015 06:31:43 GMT',
      server: 'nginx/1.8.0',
      'content-length': '156',
      connection: 'Close' });
    
    var phoneId;
    var word;
    new Phone({number: toNum}).save()
      .then(function(newNum) {
        word = 'help';
        phoneId = newNum._id;
        return assert.ok(newNum.active, 'should be true');
      }).then(function() {
        var helpMessage = {
          "From": toNum,
          "TotalRate": "0.00000",
          "Text": word,
          "To": "18005551313",
          "Units": "1",
          "TotalAmount": "0.00000",
          "Type": "sms",
          "MessageUUID": "d709da80-7dc4-11e4-a77d-22000ae383ea"
        };
        return Phone.handleIncomingMessage(helpMessage);
      }).then(function() {
        return assert.ok(m.isDone(), "m is not done");
      }).then(function() {
        done();
      });
  });

  it('phone should have a createdAt and updatedAt date', function() {
    var now = new Date();
    var p = new Phone({number: toNum});
    return p.save().then(function() {
      assert.isAtLeast(p.createdAt, now);
      assert.isAtLeast(p.updatedAt, now);
      assert.equal(p.createdAt, p.updatedAt);
    });
    //
    //
    //
    // var p = new Phone({number: toNum});
    // var om = new OutgoingMessage({body: 'outgoing message body'});
    // om.save()
    //   .then(function() {
    //     p.outgoingMessages.push( om );
    //     return p.save();})
    //       .then(function(newNum) {
    //         Phone.find({}).exec().then(function(ps){console.log('ps: ' + ps)});
    //         return Phone.findById(p._id).populate('outgoingMessages').exec()
    //       .then(function(phone) {
    //       // console.log('phone:' + phone);
    //       assert.ok(phone.createdAt);
    //       assert.ok(phone.updatedAt);
    //       return assert.ok(phone.outgoingMessages.createdAt);
    //       // TODO: this test is doing too much - and therefore the below line will fail... fix it...
    //       //assert.equal(phone.createdAt, phone.updatedAt);
    //     })
    //   });
    //   // }).then(function(phone) {
    //   //   console.log('phone:' + phone);
    //   //   assert.ok(phone.createdAt);
    //   //   assert.ok(phone.updatedAt);
    //   //   return assert.ok(phone.outgoingMessages.createdAt);
    //   //   // TODO: this test is doing too much - and therefore the below line will fail... fix it...
    //   //   //assert.equal(phone.createdAt, phone.updatedAt);
    //   // }).then(function() {
    //
    //   // });
  });

  it('should have a catchall keyword', function(done) {

    var m = helper.makeGenericNock();
    
    new Phone({number: toNum}).save()
      .then(function(newNum) {
        var noKeywordMessage = {
          "From": toNum,
          "TotalRate": "0.00000",
          "Text": 'nokey',
          "To": "18005551313",
          "Units": "1",
          "TotalAmount": "0.00000",
          "Type": "sms",
          "MessageUUID": "d709da80-7dc4-11e4-a77d-22000ae383ea"
        };
        return Phone.handleIncomingMessage(noKeywordMessage);
      }).then(function() {
        return assert.ok(m.isDone(), "m is not done");
      }).then(function() {
        done();
      })
    
  });

  it('should send unsubscribe message upon end keyword', function(done) {
    
    var m = helper.nock('https://api.plivo.com:443')
      .post('/v1/Account/' + process.env.PLIVO_AUTHID + '/Message/', {"src":process.env.PLIVO_NUMBER,"dst":toNum,"text":process.env.UNSUB_MESSAGE,"url":process.env.PLIVO_CALLBACK_URL})
      .reply(202, {"api_id":"caf37bd6-4572-11e5-bfa2-22000aXXXXXX","message":"message(s) queued","message_uuid":["fbf30c47-e717-4eba-8041-cefc93XXXXXX"]}, { 'content-type': 'application/json',
      date: 'Tue, 18 Aug 2015 06:31:43 GMT',
      server: 'nginx/1.8.0',
      'content-length': '156',
      connection: 'Close' });
    
    var phoneId;
    var word;
    new Phone({number: toNum}).save()
      .then(function(newNum) {
        word = 'stop';
        phoneId = newNum._id;
        return assert.ok(newNum.active, 'should be true');
      }).then(function() {
        var stopMessage = {
          "From": toNum,
          "TotalRate": "0.00000",
          "Text": word,
          "To": "18005551313",
          "Units": "1",
          "TotalAmount": "0.00000",
          "Type": "sms",
          "MessageUUID": "d709da80-7dc4-11e4-a77d-22000ae383ea"
        };
        return Phone.handleIncomingMessage(stopMessage);
      }).then(function() {
        return Phone.findById(phoneId).exec()
      }).then(function(updatedNum) {
        return assert.isFalse(updatedNum.active, word);
      }).then(function() {
        return assert.ok(m.isDone(), "m is not done");
      }).then(function() {
        done();
      });
  });

    it('should only create one phone on handleIncomingMessage', function() {
    helper.makeGenericNock();
    helper.makeGenericNock();
    return Phone.handleIncomingMessage({
      "From": toNum,
      "TotalRate": "0.00000",
      "Text": 'word1',
      "To": "18005551313",
      "Units": "1",
      "TotalAmount": "0.00000",
      "Type": "sms",
      "MessageUUID": "d709da80-7dc4-11e4-a77d-22000ae383ea"
    }).then(function() {
      return Phone.handleIncomingMessage({
        "From": toNum,
        "TotalRate": "0.00000",
        "Text": 'word2',
        "To": "18005551313",
        "Units": "1",
        "TotalAmount": "0.00000",
        "Type": "sms",
        "MessageUUID": "d709da80-7dc4-11e4-a77d-22000ae383ea"
    });
  }).then(function() {
    return Phone.find({number: toNum}).exec()
    }).then(function(phones) {
      assert.equal(phones.length, 1);
    })
  });

  it('should deactivate on end keyword', function() {
    var m = helper.nock('https://api.plivo.com:443')
      .post('/v1/Account/' + process.env.PLIVO_AUTHID + '/Message/', {"src":process.env.PLIVO_NUMBER,"dst":toNum,"text":process.env.UNSUB_MESSAGE,"url":process.env.PLIVO_CALLBACK_URL})
      .reply(202, {"api_id":"c1bbfa9a-3026-11e5-a541-22000aXXXXXX","message":"message(s) queued","message_uuid":["512c8a20-3a8b-425b-924b-fc2b5eXXXXXX"]}, { 'content-type': 'application/json',
      date: 'Wed, 22 Jul 2015 04:10:51 GMT',
      server: 'nginx/1.8.0',
      'content-length': '156',
      connection: 'Close' });
    var phoneId;
    var word;
    return new Phone({number: toNum}).save()
      .then(function(newNum) {
        word = 'end';
        phoneId = newNum._id;
        return assert.ok(newNum.active, 'should be true');
      }).then(function() {
        var stopMessage = {
          "From": toNum,
          "TotalRate": "0.00000",
          "Text": word,
          "To": "18005551313",
          "Units": "1",
          "TotalAmount": "0.00000",
          "Type": "sms",
          "MessageUUID": "d709da80-7dc4-11e4-a77d-22000ae383ea"
        };
        return Phone.handleIncomingMessage(stopMessage);
      }).then(function() {
        return Phone.findById(phoneId).exec()
      }).then(function(updatedNum) {
        return assert.isFalse(updatedNum.active, word);
      });
  });

  it('should deactivate on stop keyword', function() {
    var phoneId;
    var word;
    var m = helper.nock('https://api.plivo.com:443')
      .post('/v1/Account/' + process.env.PLIVO_AUTHID + '/Message/', {"src":process.env.PLIVO_NUMBER,"dst":toNum,"text":process.env.UNSUB_MESSAGE,"url":process.env.PLIVO_CALLBACK_URL})
      .reply(202, {"api_id":"c1bbfa9a-3026-11e5-a541-22000aXXXXXX","message":"message(s) queued","message_uuid":["512c8a20-3a8b-425b-924b-fc2b5eXXXXXX"]}, { 'content-type': 'application/json',
      date: 'Wed, 22 Jul 2015 04:10:51 GMT',
      server: 'nginx/1.8.0',
      'content-length': '156',
      connection: 'Close' });
    
    return new Phone({number: toNum}).save()
      .then(function(newNum) {
        word = 'StoP';
        phoneId = newNum._id;
        return assert.ok(newNum.active, 'should be true');
      }).then(function() {
        var stopMessage = {
          "From": toNum,
          "TotalRate": "0.00000",
          "Text": word,
          "To": "18005551313",
          "Units": "1",
          "TotalAmount": "0.00000",
          "Type": "sms",
          "MessageUUID": "d709da80-7dc4-11e4-a77d-22000ae383ea"
        };
        return Phone.handleIncomingMessage(stopMessage);
      }).then(function() {
        return Phone.findById(phoneId).exec()
      }).then(function(updatedNum) {
        return assert.isFalse(updatedNum.active, word);
      });
  });

  it('should set active on incoming message', function() {
    var m = helper.nock('https://api.plivo.com:443')
      .post('/v1/Account/' + process.env.PLIVO_AUTHID + '/Message/', {"src":process.env.PLIVO_NUMBER,"dst":toNum,"text":process.env.GENERIC_TEXT_RESPONSE,"url":process.env.PLIVO_CALLBACK_URL})
      .reply(202, {"api_id":"c1bbfa9a-3026-11e5-a541-22000aXXXXXX","message":"message(s) queued","message_uuid":["512c8a20-3a8b-425b-924b-fc2b5eXXXXXX"]}, { 'content-type': 'application/json',
      date: 'Wed, 22 Jul 2015 04:10:51 GMT',
      server: 'nginx/1.8.0',
      'content-length': '156',
      connection: 'Close' });
    return new Phone({number: toNum, active: false}).save()
      .then(function(newPhone) {
        return assert.isFalse(newPhone.active, 'should be false');
      }).then(function() {
        return Phone.handleIncomingMessage(helper.samplePlivoParams);
      }).then(function(p) {
        return Phone.findOne({number: toNum})
      }).then(function(num) {
        return assert.ok(num.active, 'should be true');
      });
  });


  it('should not send to non-active number', function(){
    var m = helper.nock('https://api.plivo.com:443')
      .post('/v1/Account/' + process.env.PLIVO_AUTHID + '/Message/', {"src":process.env.PLIVO_NUMBER,"dst":toNum,"text":"should not send","url":process.env.PLIVO_CALLBACK_URL})
      .reply(202, {"api_id":"c1bbfa9a-3026-11e5-a541-22000aXXXXXX","message":"message(s) queued","message_uuid":["512c8a20-3a8b-425b-924b-fc2b5eXXXXXX"]}, { 'content-type': 'application/json',
      date: 'Wed, 22 Jul 2015 04:10:51 GMT',
      server: 'nginx/1.8.0',
      'content-length': '156',
      connection: 'Close' });
    var p = new Phone({number: toNum, active: false});
    p.save().then(function() {
      p.sendMessage('should not sendx').then(function() {
        // should not get here...
        assert.isOk(false);
      }).catch(function(e) {
        return assert.equal(e.message, 'message creation error 0');
      });
    });    
  });

  it('should have plivo callback url set in env var', function() {
    assert.ok(process.env.PLIVO_CALLBACK_URL);
  });


  it('should set uuid from plivo response', function() {
    helper.nock('https://api.plivo.com:443')
      .post('/v1/Account/' + process.env.PLIVO_AUTHID + '/Message/', {"src":process.env.PLIVO_NUMBER,"dst":toNum,"text":"uuid should be set","url":process.env.PLIVO_CALLBACK_URL})
      .reply(202, {"api_id":"dc355646-336e-11e5-a541-22000aXXXXXX","message":"message(s) queued","message_uuid":["451eb6f2-58c5-49bc-b58f-3f2ed7XXXXXX"]}, { 'content-type': 'application/json',
      date: 'Sun, 26 Jul 2015 08:18:13 GMT',
      server: 'nginx/1.8.0',
      'content-length': '156',
      connection: 'Close' });
      
    var p = new Phone({number: toNum});
    return p.save()
      .then(function() {
        return p.sendMessage('uuid should be set');
      }).then(function() {
        return Phone.findById(p._id).populate('outgoingMessages').exec();
      }).then(function(phone) {
        return assert.equal(phone.outgoingMessages[0].uuid, "451eb6f2-58c5-49bc-b58f-3f2ed7XXXXXX");
      });
  });


  it('should set status to outgoing message when send', function() {    
    helper.nock('https://api.plivo.com:443')
      .post('/v1/Account/' + process.env.PLIVO_AUTHID + '/Message/', {"src":process.env.PLIVO_NUMBER,"dst":toNum,"text":"set status","url":process.env.PLIVO_CALLBACK_URL})
      .reply(202, {"api_id":"575e4f50-3025-11e5-a541-22000aXXXXXX","message":"message(s) queued","message_uuid":["71b3533b-eba3-4450-8473-49538XXXXXX"]}, { 'content-type': 'application/json',
      date: 'Wed, 22 Jul 2015 03:54:24 GMT',
      server: 'nginx/1.8.0',
      'content-length': '156',
      connection: 'Close' });
    
    var p = new Phone({number: toNum});
    return p.save()
      .then(function() {
        return p.sendMessage('set status')
      }).then(function() {
        return Phone.findById(p._id).populate('outgoingMessages').exec();
      }).then(function(phone) {
        assert.equal(phone.outgoingMessages[0].body, 'set status');
        return assert.equal(phone.outgoingMessages[0].messageStatus, 'queued');
      });
  });


  it('should set outgoing message when send', function() {
    
    helper.nock('https://api.plivo.com:443')
      .post('/v1/Account/' + process.env.PLIVO_AUTHID + '/Message/', {"src":process.env.PLIVO_NUMBER,"dst":toNum,"text":"text message","url":process.env.PLIVO_CALLBACK_URL})
      .reply(202, {"api_id":"c1bbfa9a-3026-11e5-a541-22000aXXXXXX","message":"message(s) queued","message_uuid":["512c8a20-3a8b-425b-924b-fc2b5eXXXXXX"]}, { 'content-type': 'application/json',
      date: 'Wed, 22 Jul 2015 04:04:32 GMT',
      server: 'nginx/1.8.0',
      'content-length': '156',
      connection: 'Close' });
    
    var p = new Phone({number: toNum});
    return p.save()
      .then(function() {
        return p.sendMessage('text message')
      }).then(function() {
        return Phone.findById(p._id).populate('outgoingMessages').exec();
      }).then(function(phone) {
        return assert.equal(phone.outgoingMessages[0].body, 'text message');
      });
  });

  it('should have text associated with outgoing messages', function() {
    var p = new Phone({number: toNum});
    var om = new OutgoingMessage({body: 'outgoing message body'});
    p.outgoingMessages.push(om);
    return p.save().then(function() {
      return Phone.findById(p._id);
    }).then(function(phone) {
      return assert.equal(phone.outgoingMessages.length, 1);
    });
  });

  it('should have a send text instance method', function() {
    
    var m = helper.nock('https://api.plivo.com:443')
      .post('/v1/Account/' + process.env.PLIVO_AUTHID + '/Message/', {"src":process.env.PLIVO_NUMBER,"dst":toNum,"text":"text message body","url":process.env.PLIVO_CALLBACK_URL})
      .reply(202, {"api_id":"c1bbfa9a-3026-11e5-a541-22000aXXXXXX","message":"message(s) queued","message_uuid":["512c8a20-3a8b-425b-924b-fc2b5eXXXXXX"]}, { 'content-type': 'application/json',
      date: 'Wed, 22 Jul 2015 04:10:51 GMT',
      server: 'nginx/1.8.0',
      'content-length': '156',
      connection: 'Close' });
    
    var p = new Phone({number: toNum});
    return p.save().then(function() {
      return p.sendMessage('text message body');
    }).then(function(res) {
      return assert.ok(m.isDone()); // mock is done...
    });
  });

  it('should contain list of outgoing messages', function() {
    var p = new Phone({number: toNum});
    var om = new OutgoingMessage({uuid: '6cfd5fa7-c708-4eef-8a77-ce79573b2f94', body: 'om'});
    p.outgoingMessages.push(om);
    return p.save().then(function() {
      return assert.equal(p.outgoingMessages.length, 1);      
    })
  });

  it('should create on phone and multiple incoming messages', function() {
    helper.makeGenericNock();
    helper.makeGenericNock();
    helper.makeGenericNock();
    return Phone.handleIncomingMessage(helper.samplePlivoParams)
      .then(function() {
        return Phone.handleIncomingMessage(helper.samplePlivoParams);
      }).then(function() {
        return Phone.count();
      }).then(function(c) {
        assert.equal(c, 1, 'count should be 1');
      }).then(function() {
        return Phone.handleIncomingMessage(helper.samplePlivoParams);
      }).then(function() {
        return Phone.count();
      }).then(function(c) {
        assert.equal(c, 1, 'count should still be 1');
      }).then(function() {
        return Phone.findOne({number: parseInt(helper.samplePlivoParams.From)}).exec()
      }).then(function(p) {
        assert.equal(p.incomingMessages.length, 3, 'should have 2 incoming messages');
      })
  });

  it('should create a record when createFromParams method is executed', function(){    
    var m = helper.makeGenericNock();
    return Phone.count()
      .then(function(c1){
        assert.equal(c1, 0, 'count should start at 0');
      }).then(function(){
        return Phone.handleIncomingMessage(helper.samplePlivoParams);
      }).then(function(p){
        return Phone.count();
      }).then(function(c){
        assert.equal(c, 1, 'count should be 1 but is: ' + c);
      })
  });
  
  it('should have a create method - not sure this it the mongoose / node way...', function(){
    assert.isDefined(Phone.handleIncomingMessage);
  });
  
  
  it('should have a raw property on incoming message', function () {
    var p = new Phone({number: toNum})
    var im = new IncomingMessage({raw: 'raw', body: 'body', fromNumber: '18005551212'});
    return im.save()
      .then(function() {
        p.incomingMessages.push(im);
        return p.save()
      }).then(function() {
        return Phone.findById(p._id).populate('incomingMessages').exec();
      }).then(function(phone) {
        return assert.equal(phone.incomingMessages[0].raw, 'raw');
      });
  });

  it('should have incoming messages', function() {
    var im = new IncomingMessage({body: 'body', fromNumber: 18005551212});
    var p = new Phone({number: toNum, incomingMessages: im });
    return im.save()
      .then(function() {
        p.incomingMessages.push(im)
        return p.save()
      }).then(function(res){
        return Phone.findOne({number: toNum}).populate('incomingMessages');
      }).then(function(num){
        return assert.equal(num.incomingMessages[0].body, 'body');
      });
  })

  it('should be able to set active to false', function() {
    return new Phone({number: toNum}).save()
      .then(function() {
        return Phone.findOne({number: toNum})
      }).then(function(num) {
        num.active = false;
        num.save();
        return num;
      }).then(function(num) {
        return assert.isFalse(num.active);
      })
  });

  it('should have an active property which defaults to true', function(){
    return new Phone({number: toNum}).save()
      .then(function(){
        return Phone.findOne({number: toNum})
      })
      .then(function(num){
        return assert.isTrue(num.active);
      });
  });

  it('should have a number that is unique', function() {
    console.log('got here...');
    var x = new Phone({number: toNum});
    assert.isFulfilled(x.save()).then(function(x){
      assert.equal(x.number, toNum);
    });
    // doing this for async error catching <---
    new Phone({number: toNum}).save().then(function(){
      return assert.isOk(false);
    }).catch(function(e) {
      console.log('got here!', e);
      return assert.equal(e.name, "MongoError");
    });
  });

  it('should work with promise syntax', function() {
    var r = Promise.all([
      new Phone({number: 8005551211}).save(),
      new Phone({number: 8005551212}).save(),
      new Phone({number: 8005551213}).save()
    ]).then(
      function(){
        return Phone.count();
    }).then(
      function(r) {
        return assert.equal(r, 3, 'r: ' + r);
      }
    );
    
  });
    
  it('should increment count to 1 on save', function(done) {
    count = -1;
    Phone.count(function (err, c) {
      count = c;
      assert.equal(count, 0);
      var p = new Phone({number: 8005551212});
      p.save(function(err) {
        Phone.count(function (err, c) {
          count = c;
          assert.equal(count, 1);
          done();
        });
      });
    })
  })
  
  it('should start at count 0', function(done) {
    count = -1;
    Phone.count(function (err, c) {
      if (err) throw err;
      count = c;
      assert.equal(count, 0, 'count should be 0 but is: ' + count);
      done();
    });
  });
  
  it('should exist and have number', function() {
    var p = new Phone({number: toNum});
    assert.equal(p.number, toNum);
  });
  
});

