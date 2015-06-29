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

Phone.handleIncomingMessage = function(values) {
  if(!values['From']) { console.log('values does not have a from field', values); throw 'from values is undef.'}
  return Phone.findOne({number: values.From}).exec()
    .then(function(p) {
      p = p ? p : new Phone({number: values.From})
      p.incomingMessages.push({ raw: JSON.stringify(values), body: values.Text});
      return p.save();
    })

  // return Phone.findOne({number: values.From}, function(err, p) {
  //   p = p ? p : new Phone({number: values.From})
  //   p.incomingMessages.push({ raw: JSON.stringify(values), body: values.Text});
  //   p.save();
  // });
  
  // return Phone.findOne({number: params.From}).exec()
  //   .then(function(phone){
  //     console.log('phone: ', phone);
  //     phone = phone ? phone : new Phone({ number : parseInt(params.From), active: true });
  //     phone.incomingMessages.push({ raw: JSON.stringify(params), body: params.Text} );
  //     return phone.save();
  //   }).catch(function(e){
  //     throw 'error! ' + e;
  //   });
}

module.exports = {
  Phone: Phone
}
