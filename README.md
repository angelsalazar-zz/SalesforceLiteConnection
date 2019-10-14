# SalesforceLiteConnection

it is a library that wraps Salesforce CRUD rest api. it is meant to be used in apps that require a one time connection to Salesforce.
SalesforceLiteConnection uses the Username-Password OAuth Authentication Flow.

## Requirements

1. A connected app
2. Salesforce user credentials

## Caveats

1. It does not provide a refresh token


## Installation

`npm install salesforceLiteConnection` or `yarn add salesforceLiteConnection`

## API

##### Promise<SalesforceConnection> SalesforceLiteConnection.createConnection(params)

Creates a connection to a salesforce org specify the params;

*Parameters*

_params_

Information about the  where to connect

```javascript
const SalesforceLiteConnection = require('salesforceLiteConnection');

SalesforceLiteConnection.createConnection({
  clientId: 'CONNECTED_APP_ID',
  clientSecret: 'CONNECTED_APP_SECRET',
  isProd: true|false,   // default false
  username: 'SALESFORCE_USERNAME',
  password: 'SALESFORCE_USERNAME_PASSWORD',
  secretToken: 'SALESFORCE_USERNAME_SECRET_TOKEN',
  apiVersion: 45       // default 45
})
.then(conn => {
  // perform CRUD operations using the SalesforceConnection instance
})
.catch(() => {
  // implement error handling
});
```
