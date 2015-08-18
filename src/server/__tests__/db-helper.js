global.db = require('../db');

function dropCollections() {
  return db.Prize.remove({}).execAsync()
    .then(function() {
      db.Phone.remove({}).execAsync();
    }).then(function() {
      db.PhoneGroup.remove({}).execAsync();
    }).then(function() {
      db.AccessLog.remove({}).execAsync();
    }).then(function() {
      db.OutgoingMessage.remove({}).execAsync();
    })
}

before(function(done) {
  done();
});

beforeEach(function(done) {
  done();
});

afterEach(function(done) {
  dropCollections().then(function() {
    done();
  })
});

after(function(done) {
  db.mongoose.connection.close(done);
});