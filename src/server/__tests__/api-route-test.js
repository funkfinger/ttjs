var helper = require('./test-helper');

var app = require('../index.js');
var request = require('supertest-as-promised');

var bodyParser = require('body-parser');
var sinon = require('sinon');

var sample = helper.samplePlivoParams;

var toNum = 18005551212

describe('api tests', function() {

  it('should list all prizes active prizes with inactive flag', function() {
    var p = new db.Prize({
      name: 'prize name',
      numAvailable: 1,
      numClaimed: 0,
      imageUrl: 'http://blah.com/image.jpg'
    });
    return p.saveAsync()
      .then(function() {
        return request(app)
          .get('/api/v1/prizes?inactive=1')
          .expect(200)
      }).then(function(r) {
        return assert.equal(r.body.length, 1);
      }).then(function (){
        return db.Prize.findById(p._id).execAsync()
      }).then(function(prize) {
        prize.active = false;
        return prize.saveAsync();
      }).then(function() {
        return request(app)
          .get('/api/v1/prizes?inactive=1')
          .expect(200)
      }).then(function(r) {
        return assert.equal(r.body.length, 1);
      });
    });


  it('should list only active prizes without inactive flag', function() {
    var p = new db.Prize({
      name: 'prize name',
      numAvailable: 1,
      numClaimed: 0,
      imageUrl: 'http://blah.com/image.jpg'
    });
    return p.saveAsync()
      .then(function() {
        return request(app)
          .get('/api/v1/prizes')
          .expect(200)
      }).then(function(r) {
        return assert.equal(r.body.length, 1);
      }).then(function (){
        return db.Prize.findById(p._id).execAsync()
      }).then(function(prize) {
        prize.active = false;
        return prize.saveAsync();
      }).then(function() {
        return request(app)
          .get('/api/v1/prizes')
          .expect(200)
      }).then(function(r) {
        return assert.equal(r.body.length, 0);
      });
    });

  it('should send messages to group via api', function() {
    var pg = new db.PhoneGroup({keyword: 'group'});
    var phones = [];
    var toNums = [18005551212, 18005551213, 18005551214];
    var nocks = [];
    toNums.forEach(function(num) {
      p = new db.Phone({number: num});
      p.save()
      phones.push(p);
      nocks.push(helper.nock('https://api.plivo.com:443')
        .post('/v1/Account/' + process.env.PLIVO_AUTHID + '/Message/', {"src":process.env.PLIVO_NUMBER,"dst":num,"text":"test message to group via api","url":process.env.PLIVO_CALLBACK_URL})
        .reply(202, {"api_id":"34489f3c-34f0-11e5-bfa2-22000afaXXXX","message":"message(s) queued","message_uuid":["a1d67e58-f35a-47da-ab0b-5d1cd06aXXXX"]}, { 'content-type': 'application/json',
        date: 'Tue, 28 Jul 2015 06:16:37 GMT',
        server: 'nginx/1.8.0',
        connection: 'Close' }));
    });
    pg.phones = phones;
    var pgId;
    return pg.saveAsync()
      .then(function(){
        return db.PhoneGroup.findById(pg._id).execAsync();
      }).then(function(pg1) {
        pgId = pg1._id;
        return assert.equal(pg1.phones.length, 3);
      }).then(function() {
        return request(app)
          .post('/api/v1/keyword/' + pgId + '/send')
          .send({message: "test message to group via api"})
          .expect(200);
      }).then(function() {
        return assert.ok(nocks[2].isDone());
      });
    
    
    
    
    
  })

  it('should update status on plivo response', function() {
    var uuid = "5954b6ca-f5e6-4e59-87a4-7ae2a0XXXXXX";
    helper.nock('https://api.plivo.com:443')
      .post('/v1/Account/' + process.env.PLIVO_AUTHID + '/Message/', {"src":process.env.PLIVO_NUMBER,"dst":toNum,"text":"sample","url":process.env.PLIVO_CALLBACK_URL})
      .reply(202, {"api_id":"44adaf8e-342d-11e5-a188-22000aXXXXXX","message":"message(s) queued","message_uuid":[uuid]}, { 'content-type': 'application/json',
      date: 'Tue, 18 Aug 2015 08:02:56 GMT',
      server: 'nginx/1.8.0',
      'content-length': '103',
      connection: 'Close' });
      var p = new db.Phone({number: toNum});
      return p.sendMessage('sample')
        .then(function() {
          return request(app)
            .post('/api/v1/om')
            .send({
              "To": process.env.PLIVO_NUMBER,
              "From": process.env.PLIVO_NUMBER,
              "Status": "sent",
              "MessageUUID": uuid,
              "ParentMessageUUID": uuid
            })
            .expect(200);
        }).then(function() {
          return db.OutgoingMessage.findOne({uuid: uuid}).execAsync();
        }).then(function(om) {
          return assert.equal(om.messageStatus, 'sent');
        });
    
  });

  it('should list access logs', function() {
    return new db.AccessLog({data: 'data'}).saveAsync()
      .then(function() {
        return request(app).get('/api/v1/al')
        .expect(200);        
      }).then(function(res) {
        return assert.equal(res.body[0].data, 'data');
      });
  });

  it('should list outgoing messages', function() {
    var uuid = "5954b6ca-f5e6-4e59-87a4-7ae2a0XXXXXX";
    helper.nock('https://api.plivo.com:443')
      .post('/v1/Account/' + process.env.PLIVO_AUTHID + '/Message/', {"src":process.env.PLIVO_NUMBER,"dst":toNum,"text":"sample","url":process.env.PLIVO_CALLBACK_URL})
      .reply(202, {"api_id":"44adaf8e-342d-11e5-a188-22000aXXXXXX","message":"message(s) queued","message_uuid":[uuid]}, { 'content-type': 'application/json',
      date: 'Tue, 18 Aug 2015 08:02:56 GMT',
      server: 'nginx/1.8.0',
      'content-length': '103',
      connection: 'Close' });
    
    var p = new db.Phone({number: toNum});
    return p.sendMessage('sample')
      .then(function() {
        return request(app).get('/api/v1/om')
          .expect(200)
      }).then(function(res){
        assert.equal(res.body[0].uuid, uuid);
      });
  });

  it('should dec num claimed prize count on get', function() {
    p = new db.Prize({"name": "prize name", "numAvailable": 2, "numClaimed": 1, "imageUrl": "http://example.org/image.jpg"});
    return p.saveAsync()
      .then(function() {
        return assert.equal(p.numClaimed, 1);
      }).then(function() {
        return request(app).get('/api/v1/prize/inc/' + p._id)        
          .expect(200)
      }).then(function() {
        return db.Prize.findById(p._id).execAsync()
      }).then(function(prize) {
        return assert.equal(prize.numClaimed, 0);
      });
  }),

  
  it('should return single object of updated data when inc num claimed is get', function() {
    p = new db.Prize({"name": "prize name", "numAvailable": 2, "numClaimed": 0, "imageUrl": "http://example.org/image.jpg"});
    return p.saveAsync()
      .then(function() {
        return request(app).get('/api/v1/prize/dec/' + p._id)
        .expect(200);
      }).then(function(res) {
        assert.equal(res.body.numClaimed, 1);
        return assert.equal(res.body.numRemaining, 1);
      })
  });
  
  it('should inc num claimed prize count on get', function() {
    p = new db.Prize({"name": "prize name", "numAvailable": 2, "numClaimed": 0, "imageUrl": "http://example.org/image.jpg"});
    return p.saveAsync()
      .then(function() {
        return assert.equal(p.numClaimed, 0);
      }).then(function() {
        return request(app).get('/api/v1/prize/dec/' + p._id)        
          .expect(200)
      }).then(function() {
        return db.Prize.findById(p._id).execAsync()
      }).then(function(prize) {
        return assert.equal(prize.numClaimed, 1);
      });
  }),
  
  
  it('should be able to populate phone group keyword signupResponse on create', function() {
    return request(app).post('/api/v1/keyword')
      .send({keyword: 'kw', signupResponse: 'created'})
      .expect(201)
      .then(function() {
        return db.PhoneGroup.findOne({keyword: 'kw'}).execAsync();
      }).then(function(npg) {
        return assert.equal(npg.signupResponse, 'created');
      });
  });
  
  it('should be able to update phone group keyword signupResponse', function() {
    pg = new db.PhoneGroup({keyword: 'update_sr', signupResponse: 'first'})
    return pg.saveAsync()
      .then(function() {
        return request(app).put('/api/v1/keyword/' + pg._id)
          .send({signupResponse: 'second'})
          .expect(200)
      }).then(function(){
        return db.PhoneGroup.findById(pg._id).execAsync();
      }).then(function(npg) {
        assert.equal(npg.keyword, 'update_sr'); // sanity...
        return assert.equal(npg.signupResponse, 'second');
      })
  });
  
  it('should on incoming message to keyword group, respond with a welcome message', function() {
    
    helper.nock('https://api.plivo.com:443')
      .post('/v1/Account/' + process.env.PLIVO_AUTHID + '/Message/', {"src":process.env.PLIVO_NUMBER,"dst":toNum,"text":"howdy","url":process.env.PLIVO_CALLBACK_URL})
      .reply(202, {"api_id":"44adaf8e-342d-11e5-a188-22000aXXXXXX","message":"message(s) queued","message_uuid":["5954b6ca-f5e6-4e59-87a4-7ae2a0XXXXXX"]}, { 'content-type': 'application/json',
      date: 'Mon, 27 Jul 2015 07:01:13 GMT',
      server: 'nginx/1.6.2',
      'content-length': '156',
      connection: 'Close' });
    
    return new db.PhoneGroup({keyword: 'welcome', signupResponse: 'howdy'}).saveAsync()
      .then(function() {
        return request(app).post('/api/v1/im').send({
          "From": toNum,
          "TotalRate": "0.00000",
          "Text": "WeLcOmE",
          "To": process.env.PLIVO_NUMBER,
          "Units": "1",
          "TotalAmount": "0.00000",
          "Type": "sms",
          "MessageUUID": "d709da80-7dc4-11e4-a77d-22000ae3XXXX"
        });
      }).then(function() {
        return db.PhoneGroup.findOne({keyword: 'welcome'}).populate('phones').execAsync();
      }).then(function(res) {
        return assert.equal(res.phones.length, 1);
      });
  });
  
  it('should create an access log entry on outgoing message access', function() {
    return db.AccessLog.count().execAsync()
      .then(function(count) {
        assert.equal(count, 0);
      }).then(function() {
        return request(app)
          .post('/api/v1/om')
          .send({
            "To": process.env.PLIVO_NUMBER,
            "From": 555,
            "Status": "sent",
            "MessageUUID": "blah",
            "ParentMessageUUID": "blah"
          });
      }).then(function(res) {
        return assert.equal(res.statusCode, 200);
      }).then(function() {
        return db.AccessLog.count().execAsync()
      }).then(function(count) {
        assert.equal(count, 1);
      })
  })
  
  it('should have outgoing message endpoint', function(done) {
    
// To - receiver number of the SMS
// From - sender number of the SMS
// Status - status value of the message, is one of "queued", "sent", "failed", "delivered", "undelivered" or "rejected"
// MessageUUID - a unique ID for the message
// ParentMessageUUID - ID of the first part (see notes about long SMS below)
// PartInfo - Specifies sequence information (useful for split parts in a long SMS; see notes about long SMS below)
    
    request(app)
      .post('/api/v1/om')
      .send({
        "To": process.env.PLIVO_NUMBER,
        "From": 555,
        "Status": "sent",
        "MessageUUID": "blah",
        "ParentMessageUUID": "blah"
      })
      .expect(200)
      .end(done);
  });
  
  it('should list keywords on get with phones', function() {
    var pg1 = new db.PhoneGroup({keyword: 'k1'});
    var pg2 = new db.PhoneGroup({keyword: 'k2'});
    var p = new db.Phone({number: 8005551212});
    return p.saveAsync()
      .then(function() {return pg1.saveAsync();})
      .then(function(pg) {
        pg[0].phones.push(p);
        return pg[0].saveAsync();
      }).then(function() { pg2.saveAsync(); })
      .then(function() {
        return request(app).get('/api/v1/keywords')
          .expect(200)
      }).then(function(resp) {
        assert.equal(resp.body.length, 2, resp.body);
        assert.equal(resp.body[0].keyword, 'k1');
        assert.equal(resp.body[1].keyword, 'k2');
        assert.equal(resp.body[0].phones[0].number, 8005551212);
      })
  });
  
  it('should update keyword on put', function() {
    var pg = new db.PhoneGroup({keyword: 'get_keyword'});
    return pg.saveAsync()
      .then(function() {
        return request(app).put('/api/v1/keyword/' + pg._id)
          .send({keyword: 'new_keyword'})
          .expect(200)
      }).then(function() {
        return db.PhoneGroup.findById(pg._id).execAsync();
      }).then(function(pg2) {
        assert.equal(pg2.keyword, 'new_keyword');
      })
  });

  it('should find keyword on get with id', function() {
    var pg = new db.PhoneGroup({keyword: 'get_keyword'});
    return pg.saveAsync()
      .then(function() {
        return db.PhoneGroup.findById(pg._id).execAsync()
      }).then(function(pg2) {
        return assert.equal(pg2.keyword, 'get_keyword');
      }).then(function() {
        return request(app).get('/api/v1/keyword/' + pg._id)
          .expect(200);
      }).then(function(r) {
        assert.equal(r.body.keyword, 'get_keyword');
      })
  });

  it('should create keyword on post', function() {
    return db.PhoneGroup.count().execAsync()
      .then(function(c) {
        return assert.equal(c, 0);
      })
      .then(function() {
        return request(app).post('/api/v1/keyword')
        .send({keyword: 'new_keyword'})
        .expect(201)
      })
      .then(function(res) {
        return db.PhoneGroup.count().execAsync();
      }).then(function(c) {
        return assert.equal(c, 1);
      })
  });

  it('should on incoming message add phone to a phone group if the keyword exists', function() {
    helper.makeGenericNock();
    var p;
    return new db.PhoneGroup({keyword: 'im_a_keyword'}).saveAsync()
      .then(function() {
        newSam = JSON.parse(JSON.stringify(sample));
        newSam['Text'] = 'im_a_keyword yes';
        return request(app).post('/api/v1/im').send(newSam)
      }).then(function() {
        return db.PhoneGroup.findOne({keyword: 'im_a_keyword'}).populate('phones').execAsync();
      }).then(function(pg) {
        assert.equal(pg.phones.length, 1, pg);
        return assert.equal(pg.phones[0].number, sample.From);
      })
    
  });


  it('should return 404 if prize id does not exist update', function() {
    return request(app).put('/api/v1/prize/0')
      .send({"name": "new name", "numAvailable": 1, "numClaimed": 1, "imageUrl": "http://example.org/image.jpg"})
      .expect(404)
      .then(function(res) {
        assert.equal(res.status, 404);
      });
  });

  it('should return 404 if prize id does not exist delete', function() {
    return request(app).delete('/api/v1/prize/0')
      .expect(404)
      .then(function(res) {
        assert.equal(res.status, 404);
      });
  });

  it('should update prize with put request', function() {
    p = new db.Prize({"name": "prize name", "numAvailable": 1, "numClaimed": 0, "imageUrl": "http://example.org/image.jpg"})
    return p.save()
      .then(function() {
        return request(app).put('/api/v1/prize/' + p.id)
          .send({"name": "new name", "numAvailable": 1, "numClaimed": 1, "imageUrl": "http://example.org/image.jpg"});
      }).then(function() {
        return db.Prize.findById(p.id).execAsync();
      }).then(function(prize) {
        assert.equal(prize.name, 'new name');
        assert.equal(prize.numClaimed, 1);
      })
  });
  
  it('should delete prize with delete request', function() {
    p = new db.Prize({"name": "prize name", "numAvailable": 1, "numClaimed": 0, "imageUrl": "http://example.org/image.jpg"})
    return p.save()
      .then(function() {
        return db.Prize.find({}).execAsync();
      }).then(function(prize) {
        assert.equal(prize.length, 1);
        pid = prize[0].id;
      }).then(function() {
        return request(app).delete('/api/v1/prize/' + pid)
      }).then(function() {
        return db.Prize.count()
      }).then(function(c) {
        assert.equal(c, 0);
      })
  });
  
  it('should return 404 if phone id does not exist delete', function() {
    return request(app).delete('/api/v1/phones/blah')
      .expect(404)
      .then(function(res) {
        assert.equal(res.status, 404);
      });
  });
  
  it('should delete phone with delete request', function() {
    helper.makeGenericNock();
    var pid;
    return request(app).post('/api/v1/im').send(sample)
      .then(function() {
        return db.Phone.find({});
      }).then(function(phones) {
        assert.equal(phones.length, 1);
        pid = phones[0].id;
      }).then(function() {
        return request(app).delete('/api/v1/phones/' + pid)
      }).then(function() {
        return db.Phone.count()
      }).then(function(c) {
        assert.equal(c, 0);
      })
  });
  
  it('should list phones with get request', function() {
    helper.makeGenericNock();
    return request(app).post('/api/v1/im').send(sample)
      .then(function() {
        return request(app).get('/api/v1/phones')
      }).then(function(res) {
        assert.equal(res.body[0].number, sample["From"], res.body)
      });    
  });
  
  it('should list prizes with get request', function() {
    p = new db.Prize({"name": "prize name", "numAvailable": 1, "numClaimed": 0, "imageUrl": "http://example.org/image.jpg"})
    return p.saveAsync()
      .then(function() {
        return request(app).get('/api/v1/prizes')
      }).then(function(res) {
        assert.equal(res.status, 200);
        assert.equal(res.body[0].name, 'prize name');
      })
  })
  
  it('should create a prize when posted to', function() {
    var post = {"name": "A drink on Linger Longer Lounge - specific beers, wines, and wells. Gratuity not included", "numAvailable": 5, "numClaimed": 3, "imageUrl": "http://tonguetied.rocks.s3.amazonaws.com/images/prizes/lll.jpg"}
    return request(app).post('/api/v1/prizes').send(post)
      .expect(201)
      .then(function() {
        return db.Prize.count();
      }).then(function(c) {
        assert.equal(c, 1, 'should only be one');
      });
  });
  
  it('should have a prizes endpoint', function() {
    return request(app).get('/api/v1/prizes')
      .expect(200)
      .then(function(res) {
        assert.equal(res.status, 200, 'should be 200 error');
      })
  });

  it('should create one phone and multiple incoming messages when incoming meesage is called', function() {
    helper.makeGenericNock();
    helper.makeGenericNock();
    helper.makeGenericNock();
    return request(app).post('/api/v1/im').send(sample)
      .then(function() {
        return request(app).post('/api/v1/im').send(sample)
      }).then(function() {
        return request(app).post('/api/v1/im').send(sample)
      }).then(function() {
        return db.Phone.count();
      }).then(function(c) {
        assert.equal(c, 1, 'should only be one');
      }).then(function() {
        return db.Phone.findOne({}).exec();
      }).then(function(p) {
        assert.equal(p.incomingMessages.length, 3, 'should have 3 incoming messages');
      });
  });

  it('should create a phone entry when a post is made to im', function() {
    helper.makeGenericNock();
    return request(app).post('/api/v1/im').send(sample)
      .expect(201)
      .then(function(){
        return db.Phone.count();
      }).then(function(c) {
        assert.equal(c, 1, 'should create a phone record and therefore count should equal 1');
      });
  });
  
  // i can't get spys working, not sure i need to, but it would probably be nice...
  // it('should call handleIncomingMessage on phone model', function() {
  //   // var spy = sinon.spy(db.Phone, 'handleIncomingMessage');
  //   // sinon.assert.called(spy);
  //   return request(app)
  //     .post('/api/v1/im')
  //     .send(sample)
  //     .expect(200)
  //     .then(function(){
  //       // assert.ok(spy.called);
  //     })
  // });
    
  it('should have a incoming message endpoint', function(done) {
    request(app)
      .post('/api/v1/im')
      .expect(200)
      .end(function(err, result) {
        done();
      });
  });
  
  it('should have an api endpoint', function(done) {
    request(app)
      .get('/api/v1/')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, result){
        assert.equal(result.body.app_name, 'ttapi');
        assert.equal(result.body.ver, 1);
        done();
      })
  });

});
