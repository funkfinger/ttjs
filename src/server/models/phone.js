var mongoose = require('mongoose');
var PhoneGroup = require('./phone-group').PhoneGroup;
var textMessage = require('../text_message.js');

var phoneSchema = new mongoose.Schema({
  number: { type: Number, unique: true },
  active: { type: Boolean, required: true, default: true },
  incomingMessages: [{
    raw: { type: String },
    body: { type: String }
  }],
  outgoingMessages: [{
    uuid: { type: String }
  }]
});

phoneSchema.methods.sendMessage = function(message) {
  return textMessage.send(this.model.number, message)
    .then(function(res){
      return(res);
    });
};

var Phone = mongoose.model('Phone', phoneSchema);

Phone.handleIncomingMessage = function(values) {
  if ( !values['From'] ) { throw 'from value is undef.' }
  var im = { raw: JSON.stringify(values), body: values.Text };
  var firstWord = im.body.trim().split(' ')[0];
  return Phone.findOne({number: values.From}).execAsync()
    .then(function(p) {
      p = p ? p : new Phone({number: values.From})
      p.incomingMessages.push(im);
      return p.saveAsync();
    }).then(function(p) {
      return PhoneGroup.findKeywordAndAddToGroup(firstWord, p[0]);
    });
}

module.exports = {
  Phone: Phone
}
