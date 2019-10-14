const nock = require('nock');
const axios = require('axios');

const SalesforceConnection = require('../src/SalesforceConnection');
const SalesforceUrlService = require('../src/SalesforceUrlService');

const {
  getBaseUrl,
  getRecordId,
  getOAuth,
  getMalformedQuery,
  getQuery,
  getErrorInsert,
  getInsert,
  getErrorUpdate,
  getErrorDelete
} = require('./mock/crudResponses');

const {
  getAuthAxios
} = require('./mock/helper');

axios.defaults.adapter = require('axios/lib/adapters/http');
const API_VERSION = 45;
const urlService = new SalesforceUrlService(API_VERSION);
const authAxios = getAuthAxios(getOAuth());
const noop = () => {};

describe('SalesforceConnection CRUD', () => {
  it('should not execute query if malformed', (done) => {
    const errorPayload = getMalformedQuery();
    const q = 'SELECT Id, FROM Account';

    nock(getBaseUrl())
      .get(urlService.getQueryUrl())
      .query({ q })
      .replyWithError(errorPayload);

    const connection = new SalesforceConnection(authAxios, urlService);

    connection
      .query(q)
      .then(noop)
      .catch(errorResponse => {
        expect(errorResponse).toBeInstanceOf(Array);
        expect(errorResponse.length).toBe(1);
        expect(errorResponse[0].errorCode).toBe(errorPayload[0].errorCode);
      })
      .finally(() => {
        done();
      });
  });

  it('should execute query', (done) => {
    const q = 'SELECT Id FROM Account';
    const payload = getQuery();

    nock(getBaseUrl())
      .get(urlService.getQueryUrl())
      .query({ q })
      .reply(200, payload);

    const connection = new SalesforceConnection(authAxios, urlService);

    connection
      .query(q)
      .then((data) => {
        expect(data.done).toBe(payload.done);
        expect(data.totalSize).toBe(payload.totalSize);
        expect(data.records).toMatch(payload.records);
      })
      .catch(noop)
      .finally(() => {
        done();
      });
  });

  it('should not insert record', (done) => {
    const errorPayload = getErrorInsert();
    nock(getBaseUrl())
      .post(`${urlService.getSobjectUrl()}/Account`, body => body.Name === null)
      .replyWithError(errorPayload);

    const connection = new SalesforceConnection(authAxios, urlService);
    connection
      .insert('Account', { Name: null })
      .then(noop)
      .catch(errorResponse => {
        expect(errorResponse).toBeInstanceOf(Array);
        expect(errorResponse.length).toBe(1);
        expect(errorResponse[0].errorCode).toBe(errorPayload[0].errorCode);
      })
      .finally(() => {
        done();
      });
  });

  it('should insert record', (done) => {
    const fieldsToSet = { Name: 'John Doe Account' };
    const payload = getInsert();

    nock(getBaseUrl())
      .post(`${urlService.getSobjectUrl()}/Account`, body => body.Name === fieldsToSet.Name)
      .reply(200, payload);

    const connection = new SalesforceConnection(authAxios, urlService);
    connection
      .insert('Account', fieldsToSet)
      .then(data => {
        expect(data.id).toBeDefined();
        expect(data.success).toBe(true);
      })
      .catch(noop)
      .finally(() => {
        done();
      });
  });

  it('should not update record', (done) => {
    const fakeId = '000000000000000000';
    const errorPayload = getErrorUpdate();

    nock(getBaseUrl())
      .patch(`${urlService.getSobjectUrl()}/Account/${fakeId}`, body => body.Name !== null)
      .replyWithError(errorPayload)

    const connection = new SalesforceConnection(authAxios, urlService);
    connection
      .update('Account', fakeId, { Name : 'Updated Record Name' })
      .then(noop)
      .catch((errorResponse) => {
        expect(errorResponse).toBeInstanceOf(Array);
        expect(errorResponse.length).toBe(1);
        expect(errorResponse[0].errorCode).toBe(errorPayload[0].errorCode);
      })
      .finally(() => done());
  });

  it('should update record', (done) => {
    const recordId = getRecordId();
    const mockCallback = jest.fn(_ => {
      expect(mockCallback.mock.calls.length).toBe(1);
    });

    nock(getBaseUrl())
      .patch(`${urlService.getSobjectUrl()}/Account/${recordId}`, body => body.Name !== null)
      .reply(204);

    const connection =  new SalesforceConnection(authAxios, urlService);
    connection
      .update('Account', recordId, { Name : 'Updated Record Name' })
      .then(mockCallback)
      .catch(noop)
      .finally(() => done());
  });

  it('should not delete record', (done) => {
    const fakeId = '000000000000000000';
    const errorPayload = getErrorDelete();

    nock(getBaseUrl())
      .delete(`${urlService.getSobjectUrl()}/Account/${fakeId}`)
      .replyWithError(errorPayload)

    const connection = new SalesforceConnection(authAxios, urlService);
    connection
      .delete('Account', fakeId)
      .then(noop)
      .catch((errorResponse) => {
        expect(errorResponse).toBeInstanceOf(Array);
        expect(errorResponse.length).toBe(1);
        expect(errorResponse[0].errorCode).toBe(errorPayload[0].errorCode);
      })
      .finally(() => done());
  });

  it('should delete record', (done) => {
    const recordId = getRecordId();
    const mockCallback = jest.fn(_ => {
      expect(mockCallback.mock.calls.length).toBe(1);
    });

    nock(getBaseUrl())
      .delete(`${urlService.getSobjectUrl()}/Account/${recordId}`)
      .reply(204);

    const connection =  new SalesforceConnection(authAxios, urlService);
      connection
        .delete('Account', recordId)
        .then(mockCallback)
        .catch(noop)
        .finally(() => done());
  });
});
