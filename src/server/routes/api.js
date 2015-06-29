var express = require('express');
var router = express.Router();

// putting 'controller' code here for now. will probably seperate at some point...
var db = require('../db');
var Phone = db.Phone;

router.post('/im', function(req, res) {
  Phone.handleIncomingMessage(req.body).then(function() {
    res.send({ok: true});    
  });
})

router.get('/', function (req, res) {
  res.send({app_name: 'ttapi', ver: 1});
});

module.exports = router;