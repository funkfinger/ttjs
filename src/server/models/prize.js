var mongoose = require('mongoose');

var prizeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  numAvailable: { type: Number },
  numClaimed: { type: Number },
  imageUrl: { type: String }
});

prizeSchema.statics.findByIdAnddecrementNumAvail = function(did) {
  return Prize.findById(did).exec()
    .then(function(p) {
      if(!p) {throw new Error('can not find prize with did: ' + did);}
      if (p.numClaimed < p.numAvailable) {
        p.numClaimed++;
      }
      return p.save();
    });
};

var Prize = mongoose.model('Prize', prizeSchema);


Prize.createNewFromPost = function(values) {
  prize = new Prize({
    name: values.name,
    numAvailable: values.numAvailable,
    numClaimed: values.numClaimed,
    imageUrl: values.imageUrl
  })
  return prize.saveAsync();
};

module.exports = {
  Prize: Prize
};
