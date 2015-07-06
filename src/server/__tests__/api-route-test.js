var helper = require('./test-helper');

var app = require('../index.js');
var request = require('supertest-as-promised');

var bodyParser = require('body-parser');
var sinon = require('sinon');

var sample = helper.samplePlivoParams;

describe('api tests', function() {
  
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
  
  
  it('should return 404 if id does not exist delete', function() {
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
        console.log('/api/v1/phones/ + pid: ', '/api/v1/phones/' + pid);
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
    .expect(200)
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
