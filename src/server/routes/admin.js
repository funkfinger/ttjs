var express = require('express');
var router = express.Router();
var url = require('url');
var auth = require('basic-auth')
var path = require('path');

router.all('*', function(req, res, next) {
  var credentials = auth(req);
  if (!credentials || credentials.name !== process.env.BASIC_AUTH_USER || credentials.pass !== process.env.BASIC_AUTH_PASS) {
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="example"');
    res.send('Access denied');
  } else {
    next();
  }
});

router.get('/', function (req, res) {
  res.sendFile('admin.html', {"root": path.join(__dirname, '../html')});
});

module.exports = router;
