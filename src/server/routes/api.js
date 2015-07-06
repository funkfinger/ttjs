var express = require('express');
var router = express.Router();

// putting 'controller' code here for now. will probably seperate at some point...
var db = require('../db');
var Phone = db.Phone;
var Prize = db.Prize;

// create prizes
router.post('/prizes', function (req, res) {
  Prize.createNewFromPost(req.body)
    .then(function() {
      res.status(201).send({ok: true});
    });
});

// read prizes
router.get('/prizes', function (req, res) {
  Prize.find({}).execAsync().then(function(prizes) {
    res.send(prizes);
  })
});

// update prizes
router.put('/prize/:id', function(req, res) {
  if (db.mongoose.Types.ObjectId.isValid(req.params.id)) {
    Prize.findById(req.params.id).execAsync()
      .then(function(prize) {
        if (prize) {
          prize.name = req.body.name;
          prize.numAvailable = req.body.numAvailable;
          prize.numClaimed = req.body.numClaimed;
          prize.imageUrl = req.body.imageUrl;
          return prize.save();
        }
        else {
          res.status(404).send('not found');
        }
    }).then(function() {
      res.send({ok: true});
    });
  }
  else {
    res.status(404).send('not found');
  }
})

// delete prizes
router.delete('/prize/:id', function (req, res) {
  Prize.findOneAndRemove(req.params.id).execAsync().then(function(p) {
    p ? res.send({ok: true}) : res.status(404).send('not found');
  })
});

// create phone
router.post('/im', function (req, res) {
  Phone.handleIncomingMessage(req.body).then(function() {
    res.status(201).send({ok: true});    
  });
})

// read phone list
router.get('/phones', function (req, res) {
  Phone.find({}).execAsync().then(function(phones) {
    res.send(phones);
  })
});

// delete phone
router.delete('/phones/:id', function (req, res) {
  Phone.findOneAndRemove(req.params.id).execAsync().then(function(p) {
    p ? res.send({ok: true}) : res.status(404).send('not found');
  })
});


router.get('/', function (req, res) {
  res.send({app_name: 'ttapi', ver: 1});
});

module.exports = router;