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

var send = function(toNum, text) {
  requestOptions.json = {
    'src': process.env.PLIVO_NUMBER,
    'dst': toNum,
    'text': text
  };
  return request(requestOptions);
};

module.exports = {
  request: request,
  send: send
};

