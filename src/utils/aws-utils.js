global.Promise = require('bluebird');
var AWS = require('aws-sdk');
AWS.config.setPromisesDependency(global.Promise);

process.env.MONGO_CONNECTION_STRING = process.env.LIVE_MONGO_CONNECTION_STRING;
var db = require('../server/db');
global.db = db;
// var db = require('../server/db')

var utils = {};

utils.getAllGroup = function() {
  return db.PhoneGroup.findOne({keyword: "all"}).exec().then(function(res) {
    res.forEach(function(i) {
      console.log(i.index, i._id);
    });
  }).then(function(res) {
    console.log('got here');
    return res;
  });
}

module.exports = {
  utils: utils,
  AWS: AWS,
  db: db
}




// var x = db.PhoneGroup.findOne({keyword:"all"}).exec();s