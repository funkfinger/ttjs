var express = require('express');
var app = module.exports = express();

app.get('/', function(req, res){
  res.end('Hello World');
});
app.listen(3000);
console.log('running...');