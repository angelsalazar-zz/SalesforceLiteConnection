function assert(variable, errorMessage) {
  if (variable === undefined || variable === null) {
    throw new Error(errorMessage);
  }
}

module.exports = {
  assert
};
