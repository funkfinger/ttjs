// var mongoose = Promise.promisifyAll(require('mongoose'));
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connection.on('connected', function(ref) {
  console.log('connected to db.');
});

mongoose.connection.on('error', function(err) {
  console.error('failed to connect to db', err);
})

mongoose.connection.on('disconnected', function () {  
  console.log('disconnected from db.');
});

process.on('SIGTERM', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
});

process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
});

try {
  console.log('attempting connection to db...')
  // if (!mongoose.connection.db) {
    mongoose.connect(process.env.MONGO_CONNECTION_STRING);
    console.log('getting closer...')
  // }
  // else {
  //   console.log('nope, connection already exists.')
  // }
}
catch(err) {
  console.error('db initialization failed', err);
}

module.exports = {
  mongoose: mongoose,
  Phone: require('./models/phone').Phone,
  Prize: require('./models/prize').Prize,
  PhoneGroup: require('./models/phone-group').PhoneGroup,
  OutgoingMessage: require('./models/phone').OutgoingMessage,
  IncomingMessage: require('./models/phone').IncomingMessage,
  AccessLog: require('./models/access-log').AccessLog,
  ScheduledMessage: require('./models/scheduled-message').ScheduledMessage
}

