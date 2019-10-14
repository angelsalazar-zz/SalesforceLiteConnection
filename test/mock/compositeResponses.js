function getCompositeSuccess() {
  return {
    compositeResponse: [{
      body: {
        id: '001R00000033JNuIAM',
        success: true,
        errors: []
      },
      httpHeaders: {
        Location: '/services/data/v45.0/sobjects/Account/001R00000033JNuIAM'
      },
      httpStatusCode: 201,
      referenceId: 'NewAccount'
    }, {
      body: {
        // A bunch of fields
        Id: '001R00000033JNuIAM',
        Name: 'Salesforce',
        BillingStreet: 'Landmark @ 1 Market Street',
        BillingCity: 'San Francisco',
        BillingState: 'California',
        BillingAddress: {
            street: 'Landmark @ 1 Market Street',
            city: 'San Francisco',
            state: 'California'
        }
      },
      httpHeaders: {
        ETag: '\"Jbjuzw7dbhaEG3fd90kJbx6A0ow=\"',
        'Last-Modified' : 'Fri, 22 Jul 2016 20:19:37 GMT'
      },
      httpStatusCode: 200,
      referenceId: 'NewAccountInfo'
    }, {
      body: {
        id: '003R00000025REHIA2',
        success: true,
        errors: []
      },
      httpHeaders: {
        Location: '/services/data/v45.0/sobjects/Contact/003R00000025REHIA2'
      },
      httpStatusCode: 201,
      referenceId: 'NewContact'
    }]
  };
}

module.exports = {
  getCompositeSuccess
};
