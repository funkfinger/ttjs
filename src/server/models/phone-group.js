var mongoose = require('mongoose');

var phoneGroupSchema = new mongoose.Schema( {
  keyword: { type: String, required: true },
  phones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Phone' }]
});

var PhoneGroup = mongoose.model('PhoneGroup', phoneGroupSchema);

module.exports = {
  PhoneGroup: PhoneGroup
}
