var mongoose = require('mongoose');
var PhoneGroup = require('./phone-group').PhoneGroup;
var textMessage = require('../text_message.js');

var outgoingMessageSchema = new mongoose.Schema({
  body: { type: String, required: true },
  uuid: { type: String },
  messageStatus: { type: String }
});

var phoneSchema = new mongoose.Schema({
  number: { type: Number, unique: true },
  active: { type: Boolean, required: true, default: true },
  incomingMessages: [{
    raw: { type: String },
    body: { type: String }
  }],
  outgoingMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OutgoingMessage' }]
});

phoneSchema.methods.sendMessage = function(message) {
  var self = this;
  var om = new OutgoingMessage({body: message})
  return om.save().then(function() {
    console.log(om);
    self.outgoingMessages.push(om);
    return self.saveAsync();
  }).then(function() {
    return textMessage.send(self.number, message);
  }).then(function(res) {
    if(/queued/.test(res[0].body.message)) {
      om.messageStatus = 'queued';
      return om.save();
    }
    else {
      throw new Error('something went wrong with text message creation');
    }
  });
  
  // var id = this.outgoingMessages[this.outgoingMessages.length-1];
  // return this.save()
  //   .then(function() {
  //     return textMessage.send(self.number, message);
  //   }).then(function(res) {
  //     if (/queued/.test(res[0].body.message)) {
  //       OutgoingMessage.find(function(err, res) {
  //         console.log(res);
  //       })
  //       OutgoingMessage.findById(id).execAsync().then(function(om){
  //         om.status = 'queued';
  //         return om.saveAsync();
  //       })
  //     }
  //   });
};

var Phone = mongoose.model('Phone', phoneSchema);
var OutgoingMessage = mongoose.model('OutgoingMessage', outgoingMessageSchema);

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
  Phone: Phone,
  OutgoingMessage: OutgoingMessage
}
