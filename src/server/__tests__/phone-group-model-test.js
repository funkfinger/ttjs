var helper = require('./test-helper');
var PhoneGroup = db.PhoneGroup;
var Phone = db.Phone;

describe('phone group model tests', function(done) {
    
  it('phone group should have a keyword', function() {
    pg = new PhoneGroup({keyword: 'keyw'});
    return pg.save()
      .then(function() {
        assert.equal(pg.keyword, 'keyw');
      });
  });

  it('should exist and have an array of phone ids', function() {
    var phone = new Phone({number: 18005551212});
    assert.ok(phone.save());
    var phoneGroup = new PhoneGroup({keyword: 'kw'});
    phoneGroup.phones.push(phone);
    var pgid = phoneGroup.id;
    return phoneGroup.save()
      .then(function() {
        return PhoneGroup.findById(pgid).populate('phones').execAsync()
      }).then(function(pg) {
        assert.equal(1, pg.phones.length);
        assert.equal(18005551212, pg.phones[0].number)
      })
  });
  
});
