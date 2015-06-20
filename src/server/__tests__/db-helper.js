global.assert = require('chai').assert;
global.db = require('../db');

afterEach(function() {
  db.mongoose.models = {};
});
