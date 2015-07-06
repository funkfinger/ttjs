var express = require('express');
var router = express.Router();

// putting 'controller' code here for now. will probably seperate at some point...
var db = require('../db');
var Phone = db.Phone;
var Prize = db.Prize;

router.delete('/phones/:id', function (req, res) {
  Phone.findOneAndRemove(req.params.id).execAsync().then(function(p) {
    p ? res.send({ok: true}) : res.status(404).send('not found');
  })
});

router.get('/phones', function (req, res) {
  Phone.find({}).execAsync().then(function(phones) {
    res.send(phones);
  })
});

router.delete('/prize/:id', function (req, res) {
  Prize.findOneAndRemove(req.params.id).execAsync().then(function(p) {
    p ? res.send({ok: true}) : res.status(404).send('not found');
  })
});

router.get('/prizes', function (req, res) {
  Prize.find({}).execAsync().then(function(prizes) {
    res.send(prizes);
  })
});

router.post('/prizes', function (req, res) {
  Prize.createNewFromPost(req.body)
    .then(function() {
      res.send({ok: true});
    });
});

router.post('/im', function (req, res) {
  Phone.handleIncomingMessage(req.body).then(function() {
    res.send({ok: true});    
  });
})

router.get('/', function (req, res) {
  res.send({app_name: 'ttapi', ver: 1});
});

module.exports = router;