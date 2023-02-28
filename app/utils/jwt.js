const jwt = require("jsonwebtoken");

const { jwtSecret, jwtExpiration } = require("../config");

const createToken = (payload) => {
  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpiration,
  });
  return token;
};

const verifyToken = (token) => {
  const verify = jwt.verify(token, jwtSecret);
  return verify;
};

module.exports = {
  createToken,
  verifyToken,
};
