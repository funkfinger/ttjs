var app = require('express')();
exports.app; 

app.get('/', function(req, res){
  res.end('Hello World');
});
app.listen(3000);
console.log('running...');