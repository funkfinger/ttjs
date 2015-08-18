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
  if (!self.active) {
    throw new Error('can not send to inactive phone');
  }
  var om = new OutgoingMessage({body: message})
  return om.save().then(function() {
    self.outgoingMessages.push(om);
    return self.saveAsync();
  }).then(function() {
    return textMessage.send(self.number, message);
  }).then(function(res) {
    // TODO: move to callback?...
    if(/queued/.test(res[0].body.message)) {
      om.messageStatus = 'queued';
      om.uuid = res[0].body.api_id;
      return om.saveAsync();
    }
    else {
      throw new Error('something went wrong with text message creation');
    }
  });
};

phoneSchema.methods.processStopKeywords = function(kw) {
  var deactivate = false;
  var stopKeywords = ['stop', 'end', 'unsubscribe', 'remove', 'quit', 'block']
  stopKeywords.forEach(function(skw) {
    if(kw.toLowerCase() == skw.toLowerCase()) {
      deactivate = true;
    }
  })
  this.active = deactivate ? false : true;
};

var Phone = mongoose.model('Phone', phoneSchema);
var OutgoingMessage = mongoose.model('OutgoingMessage', outgoingMessageSchema);

Phone.handleIncomingMessage = function(values) {
  //if ( !values['From'] ) { throw 'from value is undef.' }
  var im = { raw: JSON.stringify(values), body: values.Text };
  var firstWord = im.body.trim().split(' ')[0];
  var phoneId;
  return Promise.resolve(Phone.findOne({number: values.From}).execAsync()
    .then(function(p) {
      p = p ? p : new Phone({number: values.From})
      p.incomingMessages.push(im);
      p.processStopKeywords(firstWord);
      phoneId = p._id;
      return p.saveAsync();
    }).then(function(p1) {
      return PhoneGroup.findKeywordAndAddToGroup(firstWord, p1[0]);
    }).then(function(){
      return Phone.findById(phoneId).execAsync();
    }).then(function(rp) {
      return rp;
    })
  );
};

module.exports = {
  Phone: Phone,
  OutgoingMessage: OutgoingMessage
};
