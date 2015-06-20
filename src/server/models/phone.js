//var mongoose = require('../db.js').mongoose;

//var mongoose = require('mongoose');
module.exports = function(mongoose){
  var Schema = mongoose.Schema;
  var phoneSchema = new Schema({
    number: { type: Number, unique: true }
  });
  var Phone = mongoose.model('Phone', phoneSchema);
  return Phone
};
// function(mongoose) {
  // var Schema = mongoose.Schema;
  // var ObjectId = Schema.ObjectId;
  //
  // var phoneSchema = new Schema({
  //   number: { type: Number, unique: true },
  //   active: { type: Boolean, required: true, default: true }
  // });
// }

//var Phone = mongoose.model('Phone', phoneSchema);