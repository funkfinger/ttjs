var mongoose = require('mongoose')

mongoose.connection.on('connected', function(ref) {
  console.log('connected to db.');
});

mongoose.connection.on('error', function(err) {
  console.error('failed to connect to db', err);
})

try {
  console.log('attempting connection to db...')
  if (!db.mongoose.connection.db) {
    mongoose.connect(process.env.MONGO_CONNECTION_STRING);
    console.log('getting closer...')
  }
  else {
    console.log('nope, connection already exists.')
  }
}
catch(err) {
  console.error('db initialization failed', err);
}

module.exports = {
  mongoose: mongoose,
  Phone: require('./models/phone')(mongoose)
}


