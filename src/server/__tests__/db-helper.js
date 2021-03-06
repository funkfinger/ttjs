global.db = require('../db');

function dropCollections() {
  return db.Prize.remove({}).exec()
    .then(function() {
      db.Phone.remove({}).exec();
    }).then(function() {
      db.PhoneGroup.remove({}).exec();
    }).then(function() {
      db.AccessLog.remove({}).exec();
    }).then(function() {
      db.ScheduledMessage.remove({}).exec();
    }).then(function() {
      db.OutgoingMessage.remove({}).exec();
    }).then(function() {
      db.IncomingMessage.remove({}).exec();
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