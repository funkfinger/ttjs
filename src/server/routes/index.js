module.exports = function(app) {
  app.use('/', require('./home'));
  app.use('/api/v1/', require('./api'));
}