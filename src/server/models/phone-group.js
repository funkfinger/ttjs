var mongoose = require('mongoose');
var Phone = require('./phone').Phone;

var phoneGroupSchema = new mongoose.Schema( {
  keyword: { type: String, required: true, unique: true },
  signupResponse: { type: String },
  phones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Phone' }]
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
    .then(function(res){
      return res.phones;
    }).each(function(phone) {
      return phone.sendMessage(message);
    });
};

phoneGroupSchema.statics.findKeywordAndAddToGroup = function(keyword, phone) {
  var genericResponse = process.env.GENERIC_TEXT_RESPONSE;
  var pid = phone._id;
  var pg;
  return Promise.resolve(PhoneGroup.findOne({keyword: keyword.toLowerCase()}).execAsync()
    .then(function(g) {
      pg = g;
      if (pg) {
        // if (pid) {
          pg.phones.push(pid);
          return pg.saveAsync()
            .then(function() {
              return pg.signupResponse ? phone.sendMessage(pg.signupResponse) : phone.sendMessage(genericResponse);
            });
        // }
      }
      else {
        return phone.sendMessage(genericResponse);
      }
    }));


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

module.exports = {
  PhoneGroup: PhoneGroup
}
