const SOBJECTS = '/services/data/v{VERSION}.0/sobjects';
const QUERY = '/services/data/v{VERSION}.0/query';
const COMPOSITE_SOBJECT = '/services/data/v{VERSION}.0/composite/sobjects';
const COMPOSITE = '/services/data/v{VERSION}.0/composite'

const PLACEHOLDER = '{VERSION}';

/**
 * [SalesforceUrlServices stores references to the supported services]
 */
class SalesforceUrlService {
  /**
   * [constructor initializes the supported services in the given apiVersion]
   * @param {Integer} apiVersion [api version to use]
   */
  constructor(apiVersion) {
    this._sobjectUrl = SOBJECTS.replace(PLACEHOLDER, apiVersion);
    this._queryUrl = QUERY.replace(PLACEHOLDER, apiVersion);
    this._compositeSobjectUrl = COMPOSITE_SOBJECT.replace(PLACEHOLDER, apiVersion);
    this._compositeUrl = COMPOSITE.replace(PLACEHOLDER, apiVersion);
  }

  /**
   * [getSobjectUrl gets the sobjects service endpoint]
   * @return {String} [sobjects service endpoint]
   */
  getSobjectUrl() {
    return this._sobjectUrl;
  }

  /**
   * [getQueryUrl gets the query service endpoint]
   * @return {String} [query service endpoint]
   */
  getQueryUrl() {
    return this._queryUrl;
  }

  /**
   * [getCompositeSobjectUrl gets the composite sobject service endpoint]
   * @return {String} [composite sobject service endpoint]
   */
  getCompositeSobjectUrl() {
    return this._compositeSobjectUrl;
  }

  /**
   * [getCompositeUrl gets the composite service endpoint]
   * @return {String} [composite service endpoint]
   */
  getCompositeUrl() {
    return this.COMPOSITE;
  }
}

module.exports = SalesforceUrlService;
