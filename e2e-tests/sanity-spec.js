var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

// browser.ignoreSynchronization = true;

describe('Protractor Demo App', function() {
  it('should have a title', function() {
    browser.driver.get('http://localhost:3000/');
    expect(browser.driver.getTitle()).to.eventually.equal('Tongue Tied');
  });
});