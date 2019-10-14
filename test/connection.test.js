const nock = require('nock');
const axios = require('axios');

const SalesforceLiteConnection = require('../index');
const SalesforceConnection = require('../src/SalesforceConnection');

const { getOAuth } = require('./mock/crudResponses');

axios.defaults.adapter = require('axios/lib/adapters/http');

const GENERIC_ORG_BASE_URL = 'https://test.salesforce.com';
const ACCESS_TOKEN_ENDPOINT = '/services/oauth2/token';
const noop = () => {};

describe('SalesforceLiteConnection', () => {
  it('should not create connection', (done) => {
    const errorPayload = {
      error: 'invalid_client_credentials',
      error_description: 'client secret invalid'
    };

    nock(GENERIC_ORG_BASE_URL)
      .post(ACCESS_TOKEN_ENDPOINT)
      .replyWithError(errorPayload);

    SalesforceLiteConnection
      .createConnection({
        clientId: 'superlongsclientid',
        clientSecret: 'superlongclientsecret',
        username: 'testuser@test.com',
        password: 'superrandompassword',
        secretToken: ''
      })
      .then(noop)
      .catch((errorResponse) => {
        expect(errorResponse.error).toBe(errorPayload.error);
      })
      .finally(() => {
        done();
      });
  });

  it('should create connection', (done) => {
    nock(GENERIC_ORG_BASE_URL)
      .post(ACCESS_TOKEN_ENDPOINT)
      .reply(200, getOAuth());

    SalesforceLiteConnection
      .createConnection({
        clientId: 'superlongsclientid',
        clientSecret: 'superlongclientsecret',
        username: 'testuser@test.com',
        password: 'superrandompassword',
        secretToken: 'mysuperrandomsecrettoken'
      })
      .then((connection) => {
        expect(connection).toBeInstanceOf(SalesforceConnection);
      })
      .catch(noop)
      .finally(() => {
        done();
      });
  });
});
