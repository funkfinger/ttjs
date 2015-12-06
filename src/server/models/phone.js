var mongoose = require('mongoose');
var PhoneGroup = require('./phone-group').PhoneGroup;
var textMessage = require('../text_message.js');

var outgoingMessageSchema = new mongoose.Schema({
  body: { type: String, required: true },
  uuid: { type: String },
  messageStatus: { type: String },
  createdAt: { type: Date },
  updatedAt: { type: Date }
});

outgoingMessageSchema.pre('save', function(next){
  now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

var incomingMessageSchema = new mongoose.Schema({
  body: { type: String, required: true },
  raw: { type: String },
  createdAt: { type: Date },
  updatedAt: { type: Date }
});

incomingMessageSchema.pre('save', function(next){
  now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

var phoneSchema = new mongoose.Schema({
  number: { type: Number, unique: true },
  active: { type: Boolean, required: true, default: true },
  incomingMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'IncomingMessage' }],
  // incomingMessages: [{
  //   raw: { type: String },
  //   body: { type: String }
  // }],
  outgoingMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OutgoingMessage' }],
  createdAt: { type: Date },
  updatedAt: { type: Date }
});

phoneSchema.pre('save', function(next){
  now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

phoneSchema.methods.addToGroup = function(group) {
  group.phones.addToSet(this._id)
  return group.saveAsync();
}

phoneSchema.methods.sendMessage = function(message) {
  var self = this;
  if (!self.active) {
    // do nothing now...
    //throw new Error('can not send to inactive phone');
  }
  else {
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
        om.uuid = res[0].body.message_uuid;
        return om.saveAsync();
      }
      else {
        console.log(res[0].body);
        // do nothing now...
        //throw new Error('something went wrong with text message creation');
      }
    });
  }
};

phoneSchema.methods.processStopKeywords = function(kw) {
  var deactivate = false;
  var stopKeywords = ['stop', 'end', 'unsubscribe', 'remove', 'quit', 'block']
  stopKeywords.forEach(function(skw) {
    if (kw.toLowerCase() == skw.toLowerCase()) {
      this.sendMessage(process.env.UNSUB_MESSAGE);
      deactivate = true;
    }
  }.bind(this));
  this.active = deactivate ? false : true;
};

phoneSchema.methods.processHelpKeyword = function() {
  //var activeState = this.active;
  this.sendMessage(process.env.HELP_MESSAGE);
}


var Phone = mongoose.model('Phone', phoneSchema);
var OutgoingMessage = mongoose.model('OutgoingMessage', outgoingMessageSchema);
var IncomingMessage = mongoose.model('IncomingMessage', incomingMessageSchema);

Phone.handleIncomingMessage = function(values) {
  //if ( !values['From'] ) { throw 'from value is undef.' }
  var im = new IncomingMessage({ raw: JSON.stringify(values), body: values.Text });
  var firstWord = im.body.trim().split(' ')[0];
  var phoneId;
  return Promise.resolve(Phone.findOne({number: values.From}).execAsync()
    .then(function(p) {
      p = p ? p : new Phone({number: values.From})
      p.incomingMessages.push(im);
      p.processStopKeywords(firstWord);
      if(firstWord == 'help') {
        p.processHelpKeyword();
      }
      phoneId = p._id;
      return p.saveAsync();
    }).then(function(p1) {
      if(firstWord != 'help') {
        return p1[0].active ? PhoneGroup.findKeywordAndAddToGroup(firstWord, p1[0]) : null;
      }
      // return PhoneGroup.findKeywordAndAddToGroup(firstWord, p1[0]);
    }).then(function(){
      return Phone.findById(phoneId).execAsync();
    }).then(function(rp) {
      return rp;
    })
  );
};

module.exports = {
  Phone: Phone,
  OutgoingMessage: OutgoingMessage,
  IncomingMessage: IncomingMessage
};
