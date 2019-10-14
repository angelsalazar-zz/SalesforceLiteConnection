const nock = require('nock');
const axios = require('axios');

const SalesforceConnection = require('../src/SalesforceConnection');
const SalesforceUrlService = require('../src/SalesforceUrlService');

const {
  getBaseUrl,
  getOAuth,
} = require('./mock/crudResponses');

const { getCompositeSuccess } = require('./mock/compositeResponses');
const { getAuthAxios } = require('./mock/helper');

axios.defaults.adapter = require('axios/lib/adapters/http');
const API_VERSION = 45;
const urlService = new SalesforceUrlService(API_VERSION);
const authAxios = getAuthAxios(getOAuth());
const noop = () => {};

describe('SalesforceConnection COMPOSITE', () => {

  it('should compose a bunch of requests', (done) => {
    const payload = getCompositeSuccess();
    const requests = [{
      method: 'POST',
      url: '/services/data/v45.0/sobjects/Account',
      referenceId: 'NewAccount',
      body: {
        Name: 'Salesforce',
        BillingStreet: 'Landmark @ 1 Market Street',
        BillingCity: 'San Francisco',
        BillingState: 'California',
        Industry: 'Technology'
      }
    }, {
      method: 'GET',
      referenceId: 'NewAccountInfo',
      url: '/services/data/v45.0/sobjects/Account/@{NewAccount.id}'
    }, {
      method: 'POST',
      url: '/services/data/v45.0/sobjects/Contact',
      body: {
        LastName: 'John Doe',
        Title: 'CTO of @{NewAccountInfo.Name}',
        MailingStreet: '@{NewAccountInfo.BillingStreet}',
        MailingCity: '@{NewAccountInfo.BillingAddress.city}',
        MailingState: '@{NewAccountInfo.BillingState}',
        AccountId: '@{NewAccountInfo.Id}',
        Email: 'jdoe@salesforce.com',
        Phone: '1234567890'
      }
    }];

    nock(getBaseUrl())
      .post(urlService.getCompositeUrl(), body => body.length === requests.length)
      .reply(200, payload)

    const connection = new SalesforceConnection(authAxios, urlService);
    connection
      .composite(requests)
      .then(data => {

        expect(data.compositeResponse).toBeInstanceOf(Array);
        expect(data.compositeResponse.length).toBe(3);

        const allSucceeded = data.compositeResponse.every(response => response.httpStatusCode === 200 || response.httpStatusCode === 201);

        expect(allSucceeded).toBe(3);
      })
      .catch(noop)
      .finally(() => done())
  });

});
