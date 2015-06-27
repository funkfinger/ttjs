var mongoose = require('mongoose');

var phoneSchema = new mongoose.Schema({
  number: { type: Number, unique: true },
  active: { type: Boolean, required: true, default: true },
  incomingMessages: [{
    raw: { type: String },
    body: { type: String }
  }]
});

var Phone = mongoose.model('Phone', phoneSchema);

Phone.handleIncomingMessage = function(params) {
  if(!params.From) { throw 'from param is undef.'}
  return Phone.findOne({number: params.From})
    .then(function(phone){
      phone = phone ? phone : new Phone({ number : parseInt(params.From), active: true });
      phone.incomingMessages.push({ raw: JSON.stringify(params), body: params.Text} );
      return phone.save();
      // phone.save(function(err){
      //   Phone.count().then(function(c){console.log('c: ', c);});
      // });
    }).catch(function(e){
      throw 'error! ' + e;
    });
}

module.exports = {
  Phone: Phone
}
  
//   try {
//     mongoose.model('Phone', phoneSchema);
//   }
//   catch (error) {
//     console.log('model already exists.');
//   }
//   return mongoose.model('Phone');
// };
//
// phone.createPhoneFromParams = function(params) {
//   console.log(params);
// }