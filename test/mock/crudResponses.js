const BASE_URL = 'https://salesforceliteconnection.my.salesforce.com';
const RECORD_ID = '001D000000000000AZ';

function getBaseUrl() {
  return BASE_URL;
}

function getRecordId() {
  return RECORD_ID;
}

function getOAuth() {
  return {
    access_token:'su3p3rr4nd0m4cc3sst0k3npr0vid3dbys4l3sf0rc3',
    instance_url: BASE_URL,
    id:'https://test.salesforce.com/id/00000000000000000O/0000000000000000AG',
    token_type: 'Bearer',
    issued_at: '1570044725021',
    signature: 'su3p3rr4nd0ms1gn4tur3h3r3'
  }
}

function getMalformedQuery() {
  return [{
    message: '\nSELECT Id, FROM Account\n          ^\nERROR at Row:1:Column:11\nunexpected token: \'FROM\'',
    errorCode: 'MALFORMED_QUERY'
  }];
}

function getQuery() {
  return {
    done: true,
    totalSize: 0,
    records: []
  }
}

function getErrorInsert() {
  return [{
    message: 'Required fields are missing: [Name]',
    errorCode: 'REQUIRED_FIELD_MISSING',
    fields: ['Name']
  }];
}

function getInsert() {
  return {
    id : RECORD_ID,
    errors: [],
    success: true
  }
}

function getErrorUpdate(fakeId) {
  return [{
    message: `Account ID: id value of incorrect type: ${fakeId}`,
    errorCode: 'MALFORMED_ID',
    fields: [ 'Id' ]
  }]
}

function getErrorDelete(fakeId) {
  return [{
    message: `malformed id ${fakeId}`,
    errorCode: 'MALFORMED_ID',
    fields: []
  }]
}

module.exports = {
  getOAuth,
  getRecordId,
  getBaseUrl,
  getMalformedQuery,
  getQuery,
  getErrorInsert,
  getInsert,
  getErrorUpdate,
  getErrorDelete
};
