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

var PhoneGroup = mongoose.model('PhoneGroup', phoneGroupSchema);

PhoneGroup.findKeywordAndAddToGroup = function(keyword, phone) {
  var pid = phone._id;
  var pg;
  return PhoneGroup.findOne({keyword: keyword.toLowerCase()}).execAsync()
    .then(function(g) {
      pg = g;
      if(pg) {
        if (pid) {
          pg.phones.push(pid);
          return pg.saveAsync()
            .then(function() {
              return pg.signupResponse ? phone.sendMessage(pg.signupResponse) : function(){};
            });
        }
      }
      // this seems weird to me... may need to revisit, but it needs to return a 'promise
      // i probably just don't understand how promises should work...
      return function(){};
    });
};

module.exports = {
  PhoneGroup: PhoneGroup
}
