var mongoose = require('mongoose');
var PhoneGroup = require('./phone-group').PhoneGroup;

var scheduledMessageSchema = new mongoose.Schema( {
  state: { type: String, required: true, default: 'scheduled' },
  keyword: { type: String, required: true },
  message: { type: String, requires: true },
  createdAt: { type: Date },
  updatedAt: { type: Date }
});

scheduledMessageSchema.methods.sendMessage = function() {
  var self = this;
  return PhoneGroup.findOne({keyword: this.keyword}).execAsync()
    .then(function(pg) {
      return pg.sendMessage(self.message);
    }).then(function() {
      self.state = 'sent';
      return self.saveAsync();
    });
};

var ScheduledMessage = mongoose.model('ScheduledMessage', scheduledMessageSchema);

module.exports = {
  ScheduledMessage: ScheduledMessage
}
