global.Promise = require('bluebird');
var express = require('express');
var bodyParser = require('body-parser')

var app = module.exports = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

require('./routes/index')(app);

var port = process.env.PORT || 3000
app.listen(port);
console.log('running... port is:' + port);