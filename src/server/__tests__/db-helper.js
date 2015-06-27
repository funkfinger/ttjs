global.db = require('../db');

function dropCollections(done) {
  for (var i in db.mongoose.connection.collections) {
    db.mongoose.connection.collections[i].remove(function(err){
      // console.log('collection ' + i + ' dropped');
    });
    // db.mongoose.models = {};
    return done;
  }
}

before(function(done) {
  return done();
});

beforeEach(function(done) {
  dropCollections(done);
  return done();
});

afterEach(function(done) {
  // db.mongoose.connection.close(done);
  return done();
});

after(function(done) {
  db.mongoose.connection.close(done);
});