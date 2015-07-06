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
      return p.saveAsync();
  });
}

module.exports = {
  Phone: Phone
}
