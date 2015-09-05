var express = require('express');
var router = express.Router();
var url = require('url');


// putting 'controller' code here for now. will probably seperate at some point...
var db = require('../db');
var Phone = db.Phone;
var Prize = db.Prize;
var PhoneGroup = db.PhoneGroup;
var AccessLog = db.AccessLog;
var OutgoingMessage = db.OutgoingMessage;

// list access log (al)
router.get('/al', function (req, res) {
  AccessLog.find().execAsync()
    .then(function (als) {
      res.send(als);
    })
});

// list outgoing messages (om)
router.get('/om', function (req, res) {
  OutgoingMessage.find().execAsync()
    .then(function (oms) {
      res.send(oms);
    })
});

// update om status
router.post('/om', function (req, res) {
  var jsonReq =  JSON.stringify(req.body);
  var al = new AccessLog({data: jsonReq});
  al.saveAsync()
    .then(function() {
      return OutgoingMessage.findOne({uuid: req.body.ParentMessageUUID}).execAsync();      
    }).then(function(om) {
      if (om) {
        om.messageStatus = req.body.Status;
        return om.saveAsync();
      }
    }).then(function(){
      res.send({ok: true});
    })
});

// send message to keyword group
router.post('/keyword/:id/send', function (req, res) {
  PhoneGroup.findById(req.params.id).execAsync()
    .then(function(pg) {
      return pg.sendMessage(req.body.message);
    }).then(function() {
      res.send({ok: true});
    })
});


// create phonegroup (keyword)
router.post('/keyword', function (req, res) {
  var kw = req.body.keyword;
  var sr = req.body.signupResponse
  var vals = sr ? {keyword: kw, signupResponse: sr} : {keyword: kw};
  var pg = new PhoneGroup(vals).saveAsync()
    .then(function() {
      res.status(201).send({ok: true});
    });
});

// read single phonegroup keyword
router.get('/keyword/:id', function (req, res) {
  PhoneGroup.findById(req.params.id).execAsync()
    .then(function(pg) {
      res.send(pg);
    });
});

// read list of phonegroup keywords
router.get('/keywords', function (req, res) {
  PhoneGroup.find().populate('phones').execAsync()
    .then(function(pgs) {
      res.send(pgs);
    })
})

// update phonegroup keyword
router.put('/keyword/:id', function (req, res) {
  PhoneGroup.findById(req.params.id).execAsync()
    .then(function(pg) {
      pg.keyword = req.body.keyword ? req.body.keyword : pg.keyword;
      pg.signupResponse = req.body.signupResponse ? req.body.signupResponse : pg.signupResponse;
      return pg.saveAsync();
    }).then(function() {
      res.send({ok: true});
    })
});

// increment prize availabilty (actuall dec numClaimed)
router.get('/prize/inc/:id', function (req, res) {
  return Prize.findByIdAndIncrementNumAvail(req.params.id)
    .then(function(p) {
      return res.status(200).send(p);
    });
});

// decrement prize availabilty (actuall increment numClaimed)
router.get('/prize/dec/:id', function (req, res) {
  return Prize.findByIdAndDecrementNumAvail(req.params.id)
    .then(function(p) {
      return res.status(200).send(p);
    });
});


// create prizes
router.post('/prizes', function (req, res) {
  Prize.createNewFromPost(req.body)
    .then(function() {
      res.status(201).send({ok: true});
    });
});

// read prizes
router.get('/prizes', function (req, res) {
  var query = url.parse(req.url, true).query;
  var limit = query.inactive == "1" ? {} : {active: true};
  Prize.find(limit).execAsync().then(function(prizes) {
    res.send(prizes);
  })
});

// update prizes
router.put('/prize/:id', function(req, res) {
  if (db.mongoose.Types.ObjectId.isValid(req.params.id)) {
    Prize.findById(req.params.id).execAsync()
      .then(function(prize) {
        if (prize) {
          prize.name = req.body.name ? req.body.name : prize.name;
          prize.numAvailable = req.body.numAvailable ? req.body.numAvailable : prize.numAvailable;
          prize.numClaimed = req.body.numClaimed ? req.body.numClaimed : prize.numClaimed;
          prize.imageUrl = req.body.imageUrl ? req.body.imageUrl : prize.imageUrl;
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
  Phone.handleIncomingMessage(req.body).then(function(p) {
    if(p) {
      res.status(201).send({ok: true});      
    }
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