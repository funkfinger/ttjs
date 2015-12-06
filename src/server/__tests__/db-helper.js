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
      db.ScheduledMessage.remove({}).execAsync();
    }).then(function() {
      db.OutgoingMessage.remove({}).execAsync();
    }).then(function() {
      db.IncomingMessage.remove({}).execAsync();
    })
}

before(function(done) {
  done();
});

beforeEach(function(done) {
  // don't really love this... need to look into how to make it nicer...
  db.PhoneGroup.findOneAndUpdate({keyword: 'help'}, {signupResponse: process.env.HELP_RESPONSE}, {upsert: true}, function() {
    done();
  });  
});

afterEach(function(done) {
  dropCollections().then(function() {
    done();
  })
});

after(function(done) {
  db.mongoose.connection.close(done);
});