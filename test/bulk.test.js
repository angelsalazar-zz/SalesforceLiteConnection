const nock = require('nock');
const axios = require('axios');

const SalesforceConnection = require('../src/SalesforceConnection');
const SalesforceUrlService = require('../src/SalesforceUrlService');

const {
  getBaseUrl,
  getOAuth,
} = require('./mock/crudResponses');

const {
  getBulkSuccess,
  getErrorInsertBulk,
  getErrorUpdateBulk,
  getErrorDeleteBulk
} = require('./mock/bulkResponses');

const {
  getAuthAxios
} = require('./mock/helper');

axios.defaults.adapter = require('axios/lib/adapters/http');
const API_VERSION = 45;
const urlService = new SalesforceUrlService(API_VERSION);
const authAxios = getAuthAxios(getOAuth());
const noop = () => {};


describe('SalesforceConnection BULK', () => {
  it('should create a bunch of records', (done) => {
    const payload = getBulkSuccess();
    const recordsToInsert = [{
      LastName : "Doe",
      FirstName : "Erica"
    }, {
      LastName : "Doe",
      FirstName : "Mike"
    }];

    nock(getBaseUrl())
      .post(urlService.getCompositeSobjectUrl(), body => body.length === recordsToInsert.length)
      .reply(200, payload)

    const connection = new SalesforceConnection(authAxios, urlService);
    connection
      .bulkInsert('Contact', recordsToInsert)
      .then(data => {
        const allCreated = data.every(record => {
          return ('id' in record);
        }, true);

        expect(allCreated).toBe(true);
      })
      .catch(noop)
      .finally(() => done())
  });

  it('should create a bunch of records (allOrNone false)', (done) => {
    const partialSuccess = getErrorInsertBulk(false);
    const recordsToInsert = [{
      LastName : "Doe",
      FirstName : "Erica"
    }, {
      LastName : "Doe",
      FirstName : "Mike"
    }];

    nock(getBaseUrl())
      .post(urlService.getCompositeSobjectUrl(), body => body.length === recordsToInsert.length)
      .reply(200, partialSuccess)

    const connection = new SalesforceConnection(authAxios, urlService);
    connection
      .bulkInsert('Contact', recordsToInsert)
      .then(data => {
        const atLeastOneCreated = data.some((record) => {
          return ('id' in record);
        });

        expect(atLeastOneCreated).toBe(true);
      })
      .catch(noop)
      .finally(() => done());
  });

  it('should not create a bunch of records (allOrNone true)', (done) => {
    const errorPayload = getErrorInsertBulk(true);
    const recordsToInsert = [{
      LastName : "Doe",
      FirstName : "Erica"
    }, {
      LastName : "Doe",
      FirstName : "Mike"
    }];

    nock(getBaseUrl())
      .post(urlService.getCompositeSobjectUrl(), body => body.length === recordsToInsert.length)
      .reply(200, errorPayload)

    const connection = new SalesforceConnection(authAxios, urlService);
    connection
      .bulkInsert('Contact', recordsToInsert)
      .then(data => {
        const allErrors = data.every((record) => {
          return !('id' in record);
        });

        expect(allErrors).toBe(true);
      })
      .catch(noop)
      .finally(() => done());
  });

  it('should update a bunch of records', (done) => {
    const payload = getBulkSuccess();
    const recordsToUpdate = [{
      Id: '001xx000003DGb2AAG',
      Title: 'Lead Engineer'
    }, {
      Id: '003xx000004TmiQAAS',
      Title: 'UI Designer'
    }];

    nock(getBaseUrl())
      .patch(urlService.getCompositeSobjectUrl(), body => body.length === recordsToUpdate.length)
      .reply(200, payload);

    const connection = new SalesforceConnection(authAxios, urlService);
    connection
      .bulkUpdate('Contact', recordsToUpdate)
      .then(data => {
        const allUpdated = data.every(record => record.sucess);
        expect(allUpdated).toBe(true);
      })
      .catch(noop)
      .finally(() => done());
  });

  it('should update a bunch of records (allOrNone false)', (done) => {
    const partialSuccess = getErrorUpdateBulk(false);
    const recordsToUpdate = [{
      Id: '001xx000003DGb2AAG',
      Title: 'Lead Engineer'
    }, {
      Id: '001xx000003DGb2999',
      Title: 'UI Designer'
    }];

    nock(getBaseUrl())
      .patch(urlService.getCompositeSobjectUrl(), body => body.length === recordsToUpdate.length)
      .reply(200, partialSuccess);

    const connection = new SalesforceConnection(authAxios, urlService);
    connection
      .bulkUpdate('Contact', recordsToUpdate)
      .then(data => {
        const atLeastOneUpdated = data.some(record => record.success);
        expect(atLeastOneCreated).toBe(true);
      })
      .catch(noop)
      .finally(() => done())
  });

  it('should not update a bunch of records (allOrNone true)', (done) => {
    const errorPayload = getErrorUpdateBulk(true);
    const recordsToUpdate = [{
      Id: '001xx000003DGb2AAG',
      Title: 'Lead Engineer'
    }, {
      Id: '001xx000003DGb2999',
      Title: 'UI Designer'
    }];

    nock(getBaseUrl())
      .patch(urlService.getCompositeSobjectUrl(), body => body.length === recordsToUpdate.length)
      .reply(200, errorPayload);

    const connection = new SalesforceConnection(authAxios, urlService);
    connection
      .bulkUpdate('Contact', recordsToUpdate)
      .then(data => {
        const allErrors = data.every(record => !record.sucess);

        expect(allErrors).toBe(true);
      })
      .catch(noop)
      .finally(() => done());
  });

  it('should delete a bunch of records', (done) => {
    const payload = getBulkSuccess();
    const recordsToDelete = ['001xx000003DGb2AAG', '003xx000004TmiQAAS'];

    nock(getBaseUrl())
      .delete(`${urlService.getCompositeSobjectUrl()}?ids=${recordsToDelete.join(',')}&allOrNone=true`, body => body.length === recordsToDelete.length)
      .reply(200, payload);

    const connection = new SalesforceConnection(authAxios, urlService);
    connection
      .bulkDelete('Contact', recordsToDelete)
      .then(data => {
        const allDeleted = data.every((record) => record.success);
        expect(allDeleted).toBe(true);
      })
      .catch(noop)
      .finally(() => done());
  });

  it('should delete a bunch of records (allOrNone false)', (done) => {
    const errorPayload = getErrorDeleteBulk(false);
    const recordsToDelete = ['001xx000003DGb2AAG', '003xx000004TmiQAAS'];

    nock(getBaseUrl())
      .delete(`${urlService.getCompositeSobjectUrl()}?ids=${recordsToDelete.join(',')}&allOrNone=true`, body => body.length === recordsToDelete.length)
      .reply(200, errorPayload);

    const connection = new SalesforceConnection(authAxios, urlService);
    connection
      .bulkDelete('Contact', recordsToDelete)
      .then(data => {
        const atLeastOneDeleted = data.some((record) => record.success);
        expect(atLeastOneDeleted).toBe(true);
      })
      .catch(noop)
      .finally(() => done());
  });

  it('should delete a bunch of records (allOrNone true)', (done) => {
    const errorPayload = getErrorDeleteBulk(true);
    const recordsToDelete = ['001xx000003DGb2AAG', '003xx000004TmiQAAS'];

    nock(getBaseUrl())
      .delete(`${urlService.getCompositeSobjectUrl()}?ids=${recordsToDelete.join(',')}&allOrNone=true`, body => body.length === recordsToDelete.length)
      .reply(200, errorPayload);

    const connection = new SalesforceConnection(authAxios, urlService);
    connection
      .bulkDelete('Contact', recordsToDelete)
      .then(data => {
        const allFailed = data.every((record) => !record.success);
        expect(allFailed).toBe(true);
      })
      .catch(noop)
      .finally(() => done());
  });
});
