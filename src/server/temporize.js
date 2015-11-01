var rp = require('request-promise');

var schedule = function(when, callbackUrl) {
  whenString = when.toISOString().replace(/\.\d+/,'').replace(/\:/g,'').replace(/\-/g,'')
  callbackUrl = encodeURIComponent(callbackUrl);
  var url = process.env.TEMPORIZE_URL + '/v1/events/' + whenString + '/' + callbackUrl;
  return rp.post(url);
};

module.exports = {
  schedule: schedule
}
