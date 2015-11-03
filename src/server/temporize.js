// api docs- http://docs.temporize.apiary.io/
var moment = require('moment');
var rp = require('request-promise');

var schedule = function(when, callbackUrl) {
  whenString = when.toISOString().replace(/\.\d+/,'').replace(/\:/g,'').replace(/\-/g,'')
  callbackUrl = encodeURIComponent(callbackUrl);
  var url = process.env.TEMPORIZE_URL + '/v1/events/' + whenString + '/' + callbackUrl;
  return rp.post(url);
};

var formatForTemporize = function(d) {
  console.log(moment.utc(d));
  return d.format('YYYYMMDD[T]HHmmss[Z]');
  // return d.toISOString().replace(/\.\d+/,'').replace(/\:/g,'').replace(/\-/g,'');
}

module.exports = {
  schedule: schedule,
  moment: moment,
  formatForTemporize: formatForTemporize
}


