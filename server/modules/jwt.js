const randToken = require('rand-token');
const jwt = require('jsonwebtoken');
const secretKey = require('../config/secretkey').secretKey;
const options = require('../config/secretkey').options;
const TOKEN_VALID = 1;
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = {
  sign: async (user) => {
    const payload = {
      id: user.id,
      pw: user.pw,
    };

    const result = {
      access_token: jwt.sign(payload, secretKey, options),
      refresh_token: randToken.uid(10)
    }
    
    return result;
  },

  verify: async (token) => {
    let decoded;
    try {
      jwt.verify(token, secretKey);
    } catch (err) {
      if (err.message === 'jwt expired') return TOKEN_EXPIRED;
      else if (err.message === 'invalid token') return TOKEN_INVALID;
      else return TOKEN_INVALID;
    }

    return TOKEN_VALID;
  },

  refresh: async (user) => {
    const payload = {
      id: user.id,
      pw: user.pw,
    };

    return { access_token: jwt.sign(payload, secretKey, options) };
  }
}
