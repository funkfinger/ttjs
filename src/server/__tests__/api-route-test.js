var helper = require('./test-helper');

var app = require('../index.js');
var request = require('supertest-as-promised');

var bodyParser = require('body-parser');
var sinon = require('sinon');

var sample = helper.samplePlivoParams;

describe('api tests', function() {
  
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
        console.log('resp.body: ', resp.body);
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
        assert.equal(pg.phones[0].number, sample.From);
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
