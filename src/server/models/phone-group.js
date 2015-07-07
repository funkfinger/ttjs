var mongoose = require('mongoose');

var phoneGroupSchema = new mongoose.Schema( {
  keyword: { type: String, required: true, unique: true },
  phones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Phone' }]
});

var PhoneGroup = mongoose.model('PhoneGroup', phoneGroupSchema);

PhoneGroup.findKeywordAndAddToGroup = function(keyword, phone) {
  var pid = phone._id;
  console.log('phone,id: ', pid);
  return PhoneGroup.findOne({keyword: keyword}).execAsync()
    .then(function(pg) {
      if(pg) {
        if (pid) {
          pg.phones.push(pid);
          console.log('pg: ', pg);
          return pg.saveAsync();
        }
      }
      // this seems weird to me... may need to revisit, but it needs to return a 'promise
      // i probably just don't understand how promises should work...
      return function(){};
    });
}

module.exports = {
  PhoneGroup: PhoneGroup
}
