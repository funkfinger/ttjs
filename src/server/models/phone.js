module.exports = function(mongoose){
  var Schema = mongoose.Schema;
  var phoneSchema = new Schema({
    number: { type: Number, unique: true }
  });
  try {
    mongoose.model('Phone', phoneSchema);
  }
  catch (error) {
    console.log('model already exists.');
  }
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