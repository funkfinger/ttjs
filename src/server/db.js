var mongoose = require('mongoose')
module.exports = {
  mongoose: mongoose,
  Phone: require('./models/phone')(mongoose)
}



// exports.mongoose = mongoose;
//
// var Phone = exports.Phone = require('./models/phone')(mongoose)
//
// console.log(Phone)







// mongoose.connect(process.env.MONGO_CONNECTION_STRING);


//
//
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function (callback) {
//   console.log('connected to db...');
// });
