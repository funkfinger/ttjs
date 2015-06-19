var mongoose = require('../mongo.js').mongoose;

//var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
   
var phoneSchema = new Schema({
  number: { type: Number, unique: true },
  active: { type: Boolean, required: true, default: true }
});

module.exports = mongoose.model('Phone', phoneSchema);