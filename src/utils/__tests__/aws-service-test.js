var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
global.assert = chai.assert;

var utils = require('../../utils/aws-utils')
var aws = utils.AWS;
var db = utils.db;

awsMocked = require('aws-sdk-mock');

var nock = require('nock');
nock.disableNetConnect();
//nock.recorder.rec();




describe.only('aws utils tests', function() {
  
  it('should be able to connect to a database', function() {
    // console.log('utils:', utils);
    return assert.isDefined(utils.utils.getAllGroup());
  });
  
  it('should have db object', function() {
    return assert.isDefined(db, 'db should be defined');
  });
  
  it('should have aws region set', function() {
    return assert.equal(process.env.AWS_REGION, 'us-west-2');
  });
  
  it('should be able to subscribe a phone number', function() {
    
    nock('https://sns.us-west-2.amazonaws.com:443', {"encodedQueryParams":true})
      .post('/', /Action=Subscribe&Endpoint=18005551212&Protocol=(.*?)&Version=2010-03-31/)
      .reply(200, "<SubscribeResponse xmlns=\"http://sns.amazonaws.com/doc/2010-03-31/\">\n  <SubscribeResult>\n    <SubscriptionArn>XXXX</SubscriptionArn>\n  </SubscribeResult>\n  <ResponseMetadata>\n    <RequestId>XXXX</RequestId>\n  </ResponseMetadata>\n</SubscribeResponse>\n", [ 'x-amzn-RequestId',
      'XXXX',
      'Content-Type',
      'text/xml',
      'Content-Length',
      '361',
      'Date',
      'Tue, 30 May 2017 23:41:30 GMT' ]);
    
    var sns = new aws.SNS({region: process.env.AWS_REGION});
    var sub = sns.subscribe({
      Protocol: 'sms',
      TopicArn: process.env.AWS_SNS_TOPIC_ARN,
      Endpoint: '18005551212'
    }).promise();
    return sub.then(function(data) {
      return assert.isDefined(data.ResponseMetadata);
    })
    
  });
  
  it('should have a SNS object', function() {
    var sns = new aws.SNS();
    return assert.isDefined(sns, 'should have SNS object');
  });

  it('should be able to mock aws', function() {
    // console.log('aws-mock', aws.AWS);
    return assert.isDefined(awsMocked.mock, 'should be mocked object');
  });

  it('should have AWS set', function() {
    return assert.isDefined(aws, 'AWS should be defined');
  });
  
});