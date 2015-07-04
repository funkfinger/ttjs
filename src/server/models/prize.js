var mongoose = require('mongoose');

var prizeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  numAvailable: { type: Number },
  numClaimed: { type: Number }
});

var Prize = mongoose.model('Prize', prizeSchema);

module.exports = {
  Prize: Prize
}
