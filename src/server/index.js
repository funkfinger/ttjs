var express = require('express');
var app = module.exports = express();
app.db = require('./mongo').db;

app.get('/', function(req, res){
  res.end('Hello World');
});
var port = process.env.PORT || 3000
app.listen(port);
console.log('running... port is:' + port);