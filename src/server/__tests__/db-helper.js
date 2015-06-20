global.assert = require('chai').assert;
global.db = require('../db');

function dropCollections() {
  for (var i in db.mongoose.connection.collections) {
    db.mongoose.connection.collections[i].remove(function(err){
      console.log('collection ' + i + ' dropped');
    });
  }
}

before(function(done) {
  return done();
});

beforeEach(function(done) {
  dropCollections();
  return done();
});

afterEach(function(done) {
  db.mongoose.models = {};
  return done();
});

after(function(done) {
  db.mongoose.disconnect(done);
});