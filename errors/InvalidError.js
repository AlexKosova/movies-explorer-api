const { ERROR_INVALID } = require('../utils/constants');

class InvalidError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_INVALID;
  }
}

module.exports = InvalidError;