var mongoose = require('mongoose');

var accessLogSchema = new mongoose.Schema( {
  data: { type: String, required: true },
  createdAt: { type: Date },
  updatedAt: { type: Date }
});

accessLogSchema.pre('save', function(next){
  now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

var AccessLog = mongoose.model('AccessLog', accessLogSchema);

module.exports = {
  AccessLog: AccessLog
}
