var helper = require('./test-helper');
var Phone = db.Phone;
var IncomingMessage = db.IncomingMessage;
var OutgoingMessage = db.OutgoingMessage;

describe('phone model tests', function(done) {

  var toNum = 18005551212

  it('should deactivate on stop keyword', function() {
    var phoneId;
    return new Phone({number: toNum}).saveAsync()
      .then(function(newNum) {
        phoneId = newNum[0]._id;
        return assert.ok(newNum[0].active, 'should be true');
      }).then(function() {
        var stopMessage = {
          "From": toNum,
          "TotalRate": "0.00000",
          "Text": "StOp",
          "To": "18005551313",
          "Units": "1",
          "TotalAmount": "0.00000",
          "Type": "sms",
          "MessageUUID": "d709da80-7dc4-11e4-a77d-22000ae383ea"
        };
        return Phone.handleIncomingMessage(stopMessage);
      }).then(function() {
        return Phone.findById(phoneId).execAsync()
      }).then(function(updatedNum) {
        return assert.isFalse(updatedNum.active);
      });
  });

  it('should set active on incoming message', function() {
    // db.mongoose.set('debug', true)
    return new Phone({number: toNum, active: false}).saveAsync()
      .then(function(newPhone) {
        return assert.isFalse(newPhone[0].active, 'should be false');
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
    return p.saveAsync().then(function() {
      assert.throws(function() {
        p.sendMessage('should not sendx');
      })
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
    return p.saveAsync()
      .then(function() {
        return p.sendMessage('uuid should be set');
      }).then(function() {
        return Phone.findById(p._id).populate('outgoingMessages').execAsync();
      }).then(function(phone) {
        return assert.equal(phone.outgoingMessages[0].uuid, 'dc355646-336e-11e5-a541-22000aXXXXXX');
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
        return Phone.findById(p._id).populate('outgoingMessages').execAsync();
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
        return Phone.findById(p._id).populate('outgoingMessages').execAsync();
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
    p.incomingMessages.push({raw: 'raw'})
    return p.save()
      .then(function(res) {        
        return assert.equal(res.incomingMessages[0].raw, 'raw');
      });
  });

  it('should have incoming messages', function() {
    var p = new Phone({number: toNum, incomingMessages: [{body: 'body'}] });
    // p.incomingMessages.push({raw: 'raw'});
    return p.save()
      .then(function(res){
        return Phone.findOne({number: toNum});
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

  it('should have a number that is unique', function(done) {
    var x = new Phone({number: toNum}).save().then(function(){return(Phone.count());});
    assert.isFulfilled(x);
    assert.eventually.equal(x, toNum);
    var y = new Phone({number: toNum}).save().then(function(){return(Phone.count());});
    assert.isRejected(y).notify(done);
  });

  it('should work with promise syntax', function() {
    var r = Promise.all([
      new Phone({number: 8005551211}).save(),
      new Phone({number: 8005551212}).save(),
      new Phone({number: 8005551213}).save()
    ]).then(
      function(){
        return Phone.count();
    });
    return assert.eventually.equal(r, 3, 'r: ' + r);
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

