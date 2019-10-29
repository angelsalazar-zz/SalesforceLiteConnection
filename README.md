# SalesforceLiteConnection

![license](https://img.shields.io/github/license/angelsalazar/SalesforceLiteConnection)
![size](https://img.shields.io/github/repo-size/angelsalazar/SalesforceLiteConnection)

it is a promise based library that wraps Salesforce CRUD rest api. it is meant to be used in apps that require a one time connection to Salesforce.
SalesforceLiteConnection uses the Username-Password OAuth Authentication Flow as.

## Requirements

1. A connected app
2. Salesforce user credentials

## Caveats

1. It does not provide a refresh token.
2. SalesforceConnection instance can only be created through SalesforceLiteConnection.createConnection.


## Installation

`npm install salesforceliteconnection`

## API

### SalesforceLiteConnection

#### createConnection(authInfo)
Creates a connection to a salesforce org specify the params

**Parameters**

* *authInfo* `object` specifies the information about where to connect

**Return**

Promise (it resolves into an instance of SalesforceConnection);

**Example**

```javascript
const SalesforceLiteConnection = require('salesforceliteconnection');

SalesforceLiteConnection.createConnection({
  clientId: 'CONNECTED_APP_ID',                         // Required
  clientSecret: 'CONNECTED_APP_SECRET',                 // Required
  username: 'SALESFORCE_USERNAME',                      // Required
  password: 'SALESFORCE_USERNAME_PASSWORD',             // Required
  secretToken: 'SALESFORCE_USERNAME_SECRET_TOKEN',      // Required
  apiVersion: 45                                        // Optional (Default 45)
  isProd: true|false,                                   // Optional (Default false)
})
.then(conn => {
  // perform CRUD operations using the SalesforceConnection instance
})
.catch(() => {
  // implement error handling
});
```

### SalesforceConnection

#### query(soql)

Executes the given soql string.

**Parameters**

* *soql* `string` soql query to execute

**Return**

Promise (for more info the response body see https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_query.htm)

**Example**

```javascript

const { createConnection } = require('salesforceliteconnection');

createConnection(authInfo)
  .then(conn => {
    return conn.query('SELECT Id, Name FROM Account')
  })
  .then((data) => {
    console.log(data);
  });
```

#### insert(sobjectApiName, fieldsToSet)

Inserts a record.

**Parameters**

* *sobjectApiName* `string` sobject api name
* *fieldsToSet* `object` fields to set

**Return**

Promise (for more info the response body see https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_sobject_create.htm)

**Example**

```javascript

const { createConnection } = require('salesforceliteconnection');

createConnection(authInfo)
  .then(conn => {
    return conn.insert('Account', {
      Name: 'Fake Corp'
    })
  })
  .then((data) => {
    console.log(data);
  });
```

#### update(sobjectApiName, recordId, fieldsToUpdate)

Updates a record.

**Parameters**

* *sobjectApiName* `string` sobject api name
* *recordId* `string` record to update
* *fieldsToSet* `object` fields to update

**Return**

Promise (for more info the response body see https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_update_fields.htm)

**Example**

```javascript

const { createConnection } = require('salesforceliteconnection');

createConnection(authInfo)
  .then(conn => {
    return conn.update('Account', '001xx000003DGb2AAG', {
      Name: 'Fake INC.'
    })
  })
  .then((data) => {
    console.log(data);
  });
```

#### delete(sobjectApiName, recordId)

Deletes a record.

**Parameters**

* *sobjectApiName* `string` sobject api name
* *recordId* `string` record to update

**Return**

Promise (for more info the response body see https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_delete_record.htm)

**Example**

```javascript

const { createConnection } = require('salesforceliteconnection');

createConnection(authInfo)
  .then(conn => {
    return conn.delete('Account', '001xx000003DGb2AAG', {
      Name: 'Fake INC.'
    })
  })
  .then((data) => {
    console.log(data);
  });
```

#### bulkInsert(sobjectApiName, records, allOrNone)

Inserts a collection of records (up to 200 records).

**Parameters**

* *sobjectApiName* `string` sobject api name
* *records* `array` Collection of records to insert
* *allOrNone* `boolean` Indicates whether to roll back the entire request when the creation of any object fails (default true)

**Return**

Promise (for more info the response body see https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_composite_sobjects_collections_create.htm)

**Example**

```javascript

const { createConnection } = require('salesforceliteconnection');

createConnection(authInfo)
  .then(conn => {
    return conn.bulkInsert('Contact', [{
      LastName : "Doe",
      FirstName : "Erica"
    }, {
      LastName : "Doe",
      FirstName : "Mike"
    }])
  })
  .then((data) => {
    console.log(data);
  });
```

#### bulkUpdate(sobjectApiName, records, allOrNone)

Updates a collection of records (up to 200 records).

**Parameters**

* *sobjectApiName* `string` sobject api name
* *records* `array` Collection of records to update (each record must have the Id field filled)
* *allOrNone* `boolean` Indicates whether to roll back the entire request when the update of any object fails (default true)

**Return**

Promise (for more info the response body see https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_composite_sobjects_collections_update.htm)

**Example**

```javascript

const { createConnection } = require('salesforceliteconnection');

createConnection(authInfo)
  .then(conn => {
    return conn.bulkUpdate('Contact', [{
      Id: '001xx000003DGb2AAG',
      Title: 'Lead Engineer'
    }, {
      Id: '003xx000004TmiQAAS',
      Title: 'UI Designer'
    }])
  })
  .then((data) => {
    console.log(data);
  });
```

#### bulkDelete(sobjectApiName, recordIds, allOrNone)

Deletes a collection of records (up to 200 records).

**Parameters**

* *sobjectApiName* `string` sobject api name
* *recordIds* `array` Collection of record to delete
* *allOrNone* `boolean` Indicates whether to roll back the entire request when the delete of any object fails (default true)

**Return**

Promise (for more info the response body see https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_composite_sobjects_collections_delete.htm)

**Example**

```javascript

const { createConnection } = require('salesforceliteconnection');

createConnection(authInfo)
  .then(conn => {
    return conn.bulkDelete('Contact', ['001xx000003DGb2AAG', '003xx000004TmiQAAS'])
  })
  .then((data) => {
    console.log(data);
  });
```

#### composite(compositeRequest, allOrNone)

Executes a series of REST API requests in a single call.

**Parameters**

* *compositeRequest* `array` Collection of subrequests to execute
* *allOrNone* `boolean` Indicates whether to roll back the entire request when an error occurs while processing a subrequest (default true).

**Return**

Promise (for more info the response body see https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_composite_composite.htm)

**Example**

```javascript

const { createConnection } = require('salesforceliteconnection');

createConnection(authInfo)
  .then(conn => {
    return conn.composite([{
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
    }])
  })
  .then((data) => {
    console.log(data);
  });
```
