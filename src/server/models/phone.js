var Promise = require('bluebird');

module.exports = function(mongoose){
  var phoneSchema = new mongoose.Schema({
    number: { type: Number, unique: true },
    active: { type: Boolean, required: true, default: true }
  });
  try {
    mongoose.model('Phone', phoneSchema);
  }
  catch (error) {
    console.log('model already exists.');
  }
  var Phone = mongoose.model('Phone');
  
  return mongoose.model('Phone');
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