require('./db-helper.js');
var Phone = db.Phone;

describe('phone model tests', function() {

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


// var utils = require('./utils');
// var Phone = require('../models/phone');
//
// describe('phone model tests', function() {
//
//   beforeEach(function(done){
//     for (var i in mongoose.connection.collections) {
//        mongoose.connection.collections[i].remove(function() {});
//     }
//     done();
//   });
//
//   afterEach(function(done){
//     mongoose.models = {};
//     mongoose.modelSchemas = {};
//     done();
//   });
//
//   it('should be able to save', function() {
//     assert.equal(Phone.count({}, function(err, count){}), 0);
//     var n = new Phone({number: 9999999999});
//     n.save(function(err) {
//       if (err) {
//         console.log(err);
//         assert(false)
//       }
//       else {
//         assert(true);
//       };
//     });
//   });
//
//   it('should have a number', function() {
//     var n = new Phone({number: 9999999999});
//     assert(n);
//   });
//
//   it('should exist as a model', function() {
//     assert(Phone);
//   });
//
// });