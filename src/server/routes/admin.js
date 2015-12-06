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

router.get('/requests', function(req, res) {
  // Phone.find({"incomingMessages.body": {
  //       "$regex": "request",
  //       "$options": "i"
  //   }}).execAsync().then(function(prizes) {
  //     res.write("<li>" + )
  //   });
  //   res.send(prizes);
  // })
  return db.IncomingMessage.find({body: /request/}).execAsync()
    .then(function(ims) {
      // res.set('Content-Type', 'text/html');
      res.send("<h1>requests</h1><ol>");
      console.log(ims);
      return ims.forEach(function(im) {
        consoloe.log(im);
        res.send("<li>");
        res.send(im.text);
        res.send("</li>");
      })
    }).then(function() {
      console.log("GOT HEREEEEEEEEEE");
      res.end("</ol>");
    });
  
  
});

router.get('/', function (req, res) {
  res.sendFile('admin.html', {"root": path.join(__dirname, '../html')});
});

module.exports = router;

