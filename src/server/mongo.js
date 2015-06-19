var mongoose = exports.mongoose = require('mongoose');
if (!mongoose.connection) {
  mongoose.connect(process.env.MONGO_CONNECTION_STRING);
}
var db = exports.db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
  console.log('connected to db...')
});
