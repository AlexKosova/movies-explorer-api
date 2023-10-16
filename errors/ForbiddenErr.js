const { ERROR_FORBIDDEN } = require('../utils/constants');

class ForbiddenErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_FORBIDDEN;
  }
}

module.exports = ForbiddenErr;