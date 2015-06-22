global.Promise = require('bluebird');
var express = require('express');
var bodyParser = require('body-parser')

var app = module.exports = express();

app.use(bodyParser.json());

var router = require('./routes/index')(app);

var port = process.env.PORT || 3000
app.listen(port);
console.log('running... port is:' + port);