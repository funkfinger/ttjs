var mongoose = exports.mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test')
var db = exports.db = mongoose.connection;
console.log(db);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
  console.log('connected to db...')
});