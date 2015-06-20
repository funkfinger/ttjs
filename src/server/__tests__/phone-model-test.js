require('./db-helper.js');
var Phone = db.Phone;

p = new Phone({number: 8005551212}, function(err) {
  if (err) return console.error(err);
  Phone.count(function (err, count) {
    if (err) return console.error(err);
    // if (err) return console.error(err);
    console.log('count: ' + count);
  });
});

describe('phone model tests', function(done) {
  
  it('should be able to be saved', function() {
    Phone.count(function (err, count) {
      if (err) return console.error(err);
      console.log('count: ' + count);
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