require('./db-helper.js');

describe('database tests', function() {
  
  it('has Phone model', function() {
    assert(db.Phone);
  });

  it('has a test and localhost uri for mongo', function() {
    assert.include(process.env.MONGO_CONNECTION_STRING, 'localhost', 'process.env.MONGO_CONNECTION_STRING: ' + process.env.MONGO_CONNECTION_STRING);
  });

  it('mogoose should exist', function() {
    // console.log(mongoose);
    assert(db.mongoose);
  });
  
});
