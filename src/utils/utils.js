global.Promise = require('bluebird');

var AWS = require('aws-sdk');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(process.env.LIVE_MONGO_CONNECTION_STRING);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to db');
});

var utils = {}

var Phone = require('../server/models/phone').Phone;
var PhoneGroup = require('../server/models/phone-group').PhoneGroup;

utils.subscribeNumbers = function() {
  return PhoneGroup.findOne({ keyword: 'all'}).populate('phones').exec().then(function(res) {
    res.phones.forEach(function(p) {
      utils.subscribeToAwsSns(Math.floor(p.number));
    });
    return res;
  })
};

utils.setAllSnsToFalse = function() {
  Phone.setAllSnsToFalse().then(function() {
    console.log('done');
  });
};



utils.subscribeNumbersFromPhones = function() {
  return Phone.find({active: true, inSns: false}).exec().then(function(res) {
    var c = 0;
    res.forEach(function(p) {
      c++;
      utils.subscribeToAwsSns(p);
    });
    console.log('c: ', c);
  });
};

var sns = new AWS.SNS({region: process.env.AWS_REGION});

utils.subscribeToAwsSns = function(phone) {
  var sub = sns.subscribe({
    Protocol: 'sms',
    TopicArn: process.env.AWS_SNS_TOPIC_ARN,
    Endpoint: String(Math.floor(phone.number))
  }).promise();
  return sub.then(function(data) {
    phone.inSns = true;
    return phone.save();
  });
};


module.exports = {
  utils: utils,
  mongoose: mongoose,
  Phone: Phone,
  PhoneGroup: PhoneGroup,
  // OutgoingMessage: require('./src/server/models/phone').OutgoingMessage,
  // IncomingMessage: require('./src/server/models/phone').IncomingMessage,
  // AccessLog: require('./src/server/models/access-log').AccessLog,
  // ScheduledMessage: require('./src/server/models/scheduled-message').ScheduledMessage
  // Prize: require('../server/models/prize').Prize,
}









//u = require('./src/utils/utils');
//a = u.utils.subscribeNumbersFromPhones();