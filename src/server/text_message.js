var request = Promise.promisify(require('request'));
Promise.promisifyAll(request);

var auth = 'Basic ' + new Buffer(process.env.PLIVO_AUTHID + ':' + process.env.PLIVO_TOKEN)
        .toString('base64');
        
var requestOptions = {
  url: 'https://api.plivo.com/v1/Account/' + process.env.PLIVO_AUTHID + '/Message/',
  method: 'POST',
  json: true,
  headers: {
    'Authorization': auth,
    'User-Agent': 'NodePlivo',
    'Content-Type': 'application/json'    
  }
}

var send = function(dst, text, cb) {
  requestOptions.json = {
    'src': process.env.PLIVO_NUMBER,
    'dst': dst,
    'text': text,
    'url': process.env.PLIVO_CALLBACK_URL
  };
  return request(requestOptions)
    .then(function(res){
      return cb instanceof Function ? cb(res) : res;
    });
};

module.exports = {
  request: request,
  send: send
};

