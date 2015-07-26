var mongoose = require('mongoose');

var accessLogSchema = new mongoose.Schema( {
  data: { type: String, required: true }
});

var AccessLog = mongoose.model('AccessLog', accessLogSchema);

module.exports = {
  AccessLog: AccessLog
}
