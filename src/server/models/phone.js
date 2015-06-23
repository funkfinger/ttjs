module.exports = function(mongoose){
  var phoneSchema = new mongoose.Schema({
    number: { type: Number, unique: true },
    active: { type: Boolean, required: true, default: true },
    incomingMessages: [{
      raw: { type: String },
      body: { type: String }
    }]
  });
  try {
    mongoose.model('Phone', phoneSchema);
  }
  catch (error) {
    console.log('model already exists.');
  }
  return mongoose.model('Phone');
};