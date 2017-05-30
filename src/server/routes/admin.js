var express = require('express');
var router = express.Router();
var url = require('url');
var auth = require('basic-auth')
var path = require('path');

var db = require('../db');
var Phone = db.Phone;

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

router.get('/send_bulk', function(req, res) {
  res.sendFile('send_bulk.html', {"root": path.join(__dirname, '../html')});
});

router.get('/keywords.json', function(req, res) {
  return db.PhoneGroup.find().select('keyword id').exec()
  .then(function(kws) {
    res.send(kws);
  })
})

router.get('/requests.json', function(req, res) {
  return db.IncomingMessage
            .find({body: new RegExp('^\s*request', "i")}, "body createdAt fromNumber")
            // .populate('phone.number')
            .sort('-createdAt')
            .limit(100)
            .exec()
    .then(function(ims) {
      res.send(ims)
    });
});

router.get('/', function (req, res) {
  res.sendFile('admin.html', {"root": path.join(__dirname, '../html')});
});

router.get('/requests', function (req, res) {
  res.sendFile('requests.html', {"root": path.join(__dirname, '../html')});
});

module.exports = router;

