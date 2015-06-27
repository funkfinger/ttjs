var helper = require('./test-helper');
var Phone = db.Phone;
var IncomingMessage = db.IncomingMessage;

describe('phone model tests', function(done) {

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
    //
    //
    // ;
    // c.then()
    // Phone.count(function (err, c) {
    //   if (err) throw err;
    //   count = c;
    //   assert.equal(count, 0, 'count should be 0 but is: ' + count);
    //   done();
    // });
    //
    // var p = Phone.creteFromParams(helper.samplePlivoParams);
  });
  
  
  it('should have a raw property on incoming message', function () {
    var p = new Phone({number: 4})
    p.incomingMessages.push({raw: 'raw'})
    return p.save()
      .then(function(res) {        
        return assert.equal(res.incomingMessages[0].raw, 'raw');
      });
  });

  it('should have incoming messages', function() {
    var p = new Phone({number: 3, incomingMessages: [{body: 'body'}] });
    // p.incomingMessages.push({raw: 'raw'});
    return p.save()
      .then(function(res){
        return Phone.findOne({number: 3});
      }).then(function(num){
        return assert.equal(num.incomingMessages[0].body, 'body');
      });
  })

  it('should be able to set active to false', function() {
    return new Phone({number: 1}).save()
      .then(function() {
        return Phone.findOne({number: 1})
      }).then(function(num) {
        num.active = false;
        num.save();
        return num;
      }).then(function(num) {
        return assert.isFalse(num.active);
      })
  });

  it('should have an active property which defaults to true', function(){
    return new Phone({number: 1}).save()
      .then(function(){
        return Phone.findOne({number: 1})
      })
      .then(function(num){
        return assert.isTrue(num.active);
      });
  });

  it('should have a number that is unique', function(done) {
    var x = new Phone({number: 1}).save().then(function(){return(Phone.count());});
    assert.isFulfilled(x);
    assert.eventually.equal(x, 1);
    var y = new Phone({number: 1}).save().then(function(){return(Phone.count());});
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
    var p = new Phone({number: 8005551212});
    assert.equal(p.number, 8005551212);
  });
  
});

