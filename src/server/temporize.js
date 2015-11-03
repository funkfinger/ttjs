// api docs- http://docs.temporize.apiary.io/
var moment = require('moment');
var rp = require('request-promise');

var schedule = function(when, callbackUrl) {
  callbackUrl = encodeURIComponent(callbackUrl);
  var url = process.env.TEMPORIZE_URL + '/v1/events/' + formatForTemporize(when) + '/' + callbackUrl;
  return rp.post(url);
};

var formatForTemporize = function(d) {
  return d.utc().add(moment().utcOffset(), 'minutes').format('YYYYMMDD[T]HHmmss[Z]');
}

module.exports = {
  schedule: schedule,
  moment: moment,
  formatForTemporize: formatForTemporize
}


