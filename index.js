const axios = require('axios');
const queryString = require('querystring');

const SalesforceConnection = require('./src/SalesforceConnection');
const SalesforceUrlService = require('./src/SalesforceUrlService');

const SANDBOX_URL = 'https://test.salesforce.com';
const PRODUCTION_URL = 'https://login.salesforce.com';

/**
 * [createMasterPassword description]
 * @param  {String} password    [username password]
 * @param  {String} secretToken [username secret token]
 * @return {String}             [master password]
 */
function createMasterPassword(password, secretToken) {
  return `${password}${secretToken}`;
}

/**
 * [getOAuth retrieves the OAuth data.
 * it uses the Username-Password OAuth Authentication Flow, so the access token can be used only once
 * in a transanction (https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_understanding_username_password_oauth_flow.htm)]
 * @param  {Object} options [description]
 *  clientId {String},
 *  clientSecret {String},
 *  isProd {Boolean},
 *  username {String},
 *  password {String},
 *  secretToken {String}
 * @return {Promise}         [payload shape https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_understanding_username_password_oauth_flow.htm]
 */
function getOAuth(options) {
  return (
    axios
      .post(
        `${options.isProd ? PRODUCTION_URL : SANDBOX_URL}/services/oauth2/token`,
        queryString.stringify({
          grant_type: 'password',
          client_id: options.clientId,
          client_secret: options.clientSecret,
          username: options.username,
          password: createMasterPassword(options.password, options.secretToken)
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )
  );
}

/**
 * [createConnection description]
 * @param  {Object} options [description]
 *  clientId {String},
 *  clientSecret {String},
 *  isProd {Boolean},
 *  username {String},
 *  password {String},
 *  secretToken {String},
 *  apiVersion {Integer}
 * @return {Promise}         [description]
 */
function createConnection(options = {}) {
  if (!('clientId') in options) { throw new Error('clientId is required'); }
  if (!('clientSecret') in options) { throw new Error('clientSecret is required'); }
  if (!('username') in options) { throw new Error('username is required'); }
  if (!('password') in options) { throw new Error('password is required'); }
  if (!('secretToken') in options) { throw new Error('secretToken is required'); }

  options.isProd = options.isProd || false;
  options.apiVersion = options.apiVersion || 45;

  return (
    getOAuth(options)
      .then(response => {
        return new SalesforceConnection(
          axios.create({
            baseURL: response.data.instance_url,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${response.data.token_type} ${response.data.access_token}`
            }
          }),
          new SalesforceUrlService(options.apiVersion)
        )
      })
  );
}

module.exports = {
  createConnection
};
