global.Promise = require('bluebird');
var express = require('express'), env = process.env.NODE_ENV || 'development';

var bodyParser = require('body-parser')

var app = module.exports = express();

app.disable('x-powered-by');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// forcing ssl in production... see http://stackoverflow.com/questions/7185074/heroku-nodejs-http-to-https-ssl-forced-redirect
var forceSsl = function (req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }
  return next();
};

if (process.env.NODE_ENV === 'production') {
  app.use(forceSsl);
}

require('./routes/index')(app);

var port = process.env.PORT || 3000
app.listen(port);
console.log('running... port is:' + port);