function getBulkSuccess() {
  return [{
    id: '001RM000003oLnnYAE',
    success: true,
    errors: []
  }, {
    id: '003RM0000068xV6YAI',
    success: true,
    errors: []
  }]
}

function getErrorInsertBulk(allOrNone) {
  return (
    !allOrNone
    ? ([{
      success: false,
      errors: [{
        statusCode: 'DUPLICATES_DETECTED',
        message: 'Use one of these records?',
        fields: []
      }]
    }, {
      success: true,
      id: '003RM0000068xVCYAY',
      errors: []
    }]) : ([{
      success: false,
      errors: [{
        statusCode: 'DUPLICATES_DETECTED',
        message: 'Use one of these records?',
        fields: []
      }]
    }, {
      success: false,
      errors: [{
        statusCode: 'ALL_OR_NONE_OPERATION_ROLLED_BACK',
        message: 'Record rolled back because not all records were valid and the request was using AllOrNone header',
        fields: []
      }]
    }])
  );
}

function getErrorUpdateBulk(allOrNone) {
  return (
    !allOrNone
    ? ([{
      id: '001RM000003oCprYAE',
      success: true,
      errors: []
    }, {
      success: false,
      errors: [{
        statusCode: 'MALFORMED_ID',
        message: 'Contact ID: id value of incorrect type: 001xx000003DGb2999',
        fields: ['Id']
      }]
    }]) : ([{
      id : '001RM000003oCprYAE',
      success : false,
      errors : [{
        statusCode : 'ALL_OR_NONE_OPERATION_ROLLED_BACK',
        message : 'Record rolled back because not all records were valid and the request was using AllOrNone header',
        fields : [ ]
      }]
   }, {
      success : false,
      errors : [{
        statusCode : 'MALFORMED_ID',
        message : 'Contact ID: id value of incorrect type: 001xx000003DGb2999',
        fields : ['Id']
      }]
   }])
  );
}

function getErrorDeleteBulk(allOrNone) {
  return (
    !allOrNone
    ? ([{
      id: '001RM000003oLrHYAU',
      success: true,
      errors: []
    }, {
      success: false,
      errors: [{
        statusCode: 'MALFORMED_ID',
        message: 'malformed id 001RM000003oLrB000',
        fields: []
      }]
    }]) : ([{
      id: '001RM000003oLruYAE',
      success: false,
      errors: [{
        statusCode: 'ALL_OR_NONE_OPERATION_ROLLED_BACK',
        message: 'Record rolled back because not all records were valid and the request was using AllOrNone header',
        fields: []
      }]
    }, {
      success: false,
      erros: [{
        statusCode: 'MALFORMED_ID',
        message: 'malformed id 001RM000003oLrB000',
        fields: []
      }]
    }])
  )
}

module.exports = {
  getBulkSuccess,
  getErrorInsertBulk,
  getErrorUpdateBulk,
  getErrorDeleteBulk
};
