var mongoose = require('mongoose');
var Phone = require('./phone').Phone;
var OutgoingMessage = require('./phone').OutgoingMessage;
var textMessage = require('../text_message.js');

var phoneGroupSchema = new mongoose.Schema( {
  keyword: { type: String, required: true, unique: true },
  signupResponse: { type: String },
  phones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Phone' }] // ugh, can not be unique - see https://github.com/Automattic/mongoose/issues/3347
});

// lowercase keyword on save...
phoneGroupSchema.pre('save', function(next) {
  this.keyword = this.keyword.toLowerCase();
  next();
});

phoneGroupSchema.methods.sendMessage = function(message) {
  var self = this;
  var phonesList = [];
  // this seems horrible - but can't figure out a way to populate self...
  return PhoneGroup.findById(this._id).populate('phones').execAsync()
    .then(function(res) {
      return res.phones;
    }).each(function(phone) {
      return phone.sendMessage(message);
    });
};


phoneGroupSchema.methods.sendBulkMessage = function(message) {
  return this.getActivePhonesAsString()
    .then(function(tos) {
      return textMessage.send(tos, message);
    }).then(function(res) {
      // TODO: move to callback?...
      if(/queued/.test(res[0].body.message)) {
        // TODO: fix this...
        // om = new OutgoingMessage({body: message})
        // om.messageStatus = 'queued';
        // om.uuid = res[0].body.message_uuid;
        // return om.saveAsync();
      }
      else {
        console.log(res[0].body);
        // do nothing now...
        //throw new Error('something went wrong with text message creation');
      }
    });
};


phoneGroupSchema.methods.addPhoneIdsToGroup = function(phoneIdArray) {
  var self = this;
  var Phone = require('./phone').Phone;
  
  return new Promise(function(resolve, reject) {
    phoneIdArray.forEach(function(pid) {
      pid = String(pid);
      if (mongoose.Types.ObjectId.isValid(pid)) {
        return Phone.findById(pid).execAsync()
          .then(function(p) {
            if(p) {
              return p.addToGroup(self);
            }
          }).then(function() {
            return self.saveAsync();
          }).then(resolve);
      };
    }.bind(this));    
  });
};

phoneGroupSchema.methods.getActivePhonesAsString = function() {
  var phoneNumberArray = [];
  return PhoneGroup.findById(this._id).populate('phones').execAsync()
    .then(function(res) {
      return res.phones;
    }).each(function(phone) {
      if (phone.active) phoneNumberArray.push(phone.number);
      return;
    })
    .then(function() {
      return phoneNumberArray.join("<");
    });
}

phoneGroupSchema.statics.findKeywordAndAddToGroup = function(keyword, phone) {
  var response = process.env.GENERIC_TEXT_RESPONSE;
  return PhoneGroup.findOne({keyword: keyword.toLowerCase()}).execAsync()
    .then(function(g) {
      if (g) {
        response = g.signupResponse ? g.signupResponse : response;
        g.phones.addToSet(phone._id);
        return Promise.resolve(g.saveAsync());
      }
      return;
    }).then(function() {
      return phone.sendMessage(response);
    });    
};

var PhoneGroup = mongoose.model('PhoneGroup', phoneGroupSchema);

// PhoneGroup.findKeywordAndAddToGroup = function(keyword, phone) {
//   var genericResponse = Phone.genericResponse();
//   var pid = phone._id;
//   var pg;
//   return Promise.resolve(PhoneGroup.findOne({keyword: keyword.toLowerCase()}).execAsync()
//     .then(function(g) {
//       pg = g;
//       if (pg) {
//         // if (pid) {
//           pg.phones.push(pid);
//           return pg.saveAsync()
//             .then(function() {
//               return pg.signupResponse ? phone.sendMessage(pg.signupResponse) : phone.sendMessage(genericResponse);
//             });
//         // }
//       }
//       else {
//         return phone.sendMessage(genericResponse);
//       }
//     }));
// };

// PhoneGroup.findOneAndUpdate({keyword: 'help'}, {signupResponse: process.env.HELP_RESPONSE}, {upsert: true}, function() {
//   console.log('help phone group created...');
// });


//.execAsync()
//  .then(function() {
//    console.log('help phone group created...');
//  });

module.exports = {
  PhoneGroup: PhoneGroup
}
