const { assert } = require('./utils');

/**
 * [SalesforceConnection performs CRUD operations
 * by using the authenticated http]
 */
class SalesforceConnection {
  /**
   * [constructor creates an instance of SalesforceConnection]
   * @param {Axios} http       [authenticated http service]
   * @param {SalesforceUrlServices} urlService [keeps references to the salesforce CRUD services]
   */
  constructor(http, urlService) {
    this._http = http;
    this._urlService = urlService;
  }

  /**
   * [query executes the given soql query]
   * @param  {String} q [valid soql query]
   * @return {Promise}      [payload shape https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_query.htm]
   */
  query(q) {
    assert(q, 'query is required');

    return (
      this
        ._http
        .get(this._urlService.getQueryUrl(), {
          params: { q }
        })
        .then(response => response.data)
    );
  }

  /**
   * [insert creates a record]
   * @param  {String} sobjectApiName [Salesforce Object]
   * @param  {Object} fieldsToSet    [Fields to set]
   * @return {Promise}                [payload shape https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_sobject_create.htm]
   */
  insert(sobjectApiName, fieldsToSet) {
    assert(sobjectApiName, 'sobjectApiName is required');
    assert(fieldsToSet, 'fieldsToSet is required');

    return (
      this
        ._http
        .post(`${this._urlService.getSobjectUrl()}/${sobjectApiName}`, fieldsToSet)
        .then(response => response.data)
    );
  }

  /**
   * [update updates a record]
   * @param  {String} sobjectApiName [Salesforce Object]
   * @param  {String} recordId       [record to update]
   * @param  {Object} fieldsToUpdate [Fields to update]
   * @return {Promise}                [payload shape https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_update_fields.htm]
   */
  update(sobjectApiName, recordId, fieldsToUpdate) {
    assert(sobjectApiName, 'sobjectApiName is required');
    assert(recordId, 'recordId is required');
    assert(fieldsToUpdate, 'fieldsToUpdate is required');

    return (
      this
        ._http
        .patch(`${this._urlService.getSobjectUrl()}/${sobjectApiName}/${recordId}`, fieldsToUpdate)
    );
  }

  /**
   * [delete deletes a record]
   * @param  {String} sobjectApiName [Salesforce Object]
   * @param  {String} recordId       [record to delete]
   * @return {Promise}                [payload shape https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_delete_record.htm]
   */
  delete(sobjectApiName, recordId) {
    assert(sobjectApiName, 'sobjectApiName is required');
    assert(recordId, 'recordId is required');

    return (
      this
        ._http
        .delete(`${this._urlService.getSobjectUrl()}/${sobjectApiName}/${recordId}`)
    )
  }

  /**
   * [bulkInsert description]
   * @param  {String}  sobjectApiName   [Salesforce Object]
   * @param  {Array}   records     [records to create]
   * @param  {Boolean} allOrNone [indicates whether to roll back the entire request
   * when the creation of any object fails (true) or to continue with the independent creation of other objects in the request]
   * @return {Promise}                   [payload shape https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_composite_sobjects_collections_create.htm]
   */
  bulkInsert(sobjectApiName, records = [], allOrNone = true) {
    assert(sobjectApiName, 'sobjectApiName is required');
    assert(records, 'records are required');

    return (
      this
        ._http
        .post(this._urlService.getCompositeSobjectUrl(), {
          allOrNone,
          records: records.map((obj) => Object.assign({}, obj, { attributes : { type: sobjectApiName } }))
        })
        .then(response => response.data)
    )
  }

  /**
   * [bulkUpdate description]
   * @param  {String}  sobjectApiName   [Salesforce Object]
   * @param  {Array}   [records=[]]     [records to update (Each obj must have the Id field set)]
   * @param  {Boolean} [allOrNone=true] [indicates whether to roll back the entire request
   * when the creation of any object fails (true) or to continue with the independent creation of other objects in the request]
   * @return {Promise}                   [payload shape https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_composite_sobjects_collections_update.htm]
   */
  bulkUpdate(sobjectApiName, records = [], allOrNone = true) {
    assert(sobjectApiName, 'sobjectApiName is required');
    assert(records, 'records are required');

    return (
      this
        ._http
        .patch(this._urlService.getCompositeSobjectUrl(), {
          allOrNone,
          records: records.reduce((array, obj) => {
            if (!('Id' in obj)) { return array; }
            const copy = Object.assign({}, obj, { attributes : { type: sobjectApiName } });
            copy.id = copy.Id;
            delete copy.Id;
            array.push(copy);
            return array;
          }, [])
        })
        .then(response => response.data)
    );
  }

  /**
   * [bulkDelete description]
   * @param  {String}  sobjectApiName   [Salesforce Object]
   * @param  {Array}   recordIds   [records to delete]
   * @param  {Boolean} allOrNone [indicates whether to roll back the entire request
   * when the creation of any object fails (true) or to continue with the independent creation of other objects in the request]
   * @return {Promise}                   [payload shape https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_composite_sobjects_collections_delete.htm]
   */
  bulkDelete(sobjectApiName, recordIds = [], allOrNone = true) {
    assert(sobjectApiName, 'sobjectApiName is required');
    assert(recordIds, 'recordIds are required');

    return (
      this
        ._http
        .delete(this._urlService.getCompositeSobjectUrl(), {
          params: {
            ids: recordIds.join(','),
            allOrNone
          }
        })
        .then(response => response.data)
    )
  }

  /**
   * [composite executes a series of REST API requests in a single call.]
   * @param  {String}  sobjectApiName   [Salesforce Object]
   * @param  {Array}  compositeRequest [Collection of subrequests to execute.]
   * @param  {Boolean} allOrNone        [indicates whether to roll back the entire request
   * when the creation of any object fails (true) or to continue with the independent creation of other objects in the request]
   * @return {[type]}                   [https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_composite_composite.htm]
   */
  composite(compositeRequest, allOrNone = true) {
    assert(compositeRequest, 'compositeRequest are required');

    return (
      this
        ._http
        .post(this._urlService.getCompositeUrl(), {
          allOrNone,
          compositeRequest
        })
    )
  }
}

module.exports = SalesforceConnection;
