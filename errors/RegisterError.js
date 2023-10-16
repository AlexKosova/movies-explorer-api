const { ERROR_REGISTER } = require('../utils/constants');

class RegisterError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_REGISTER;
  }
}

module.exports = RegisterError;