const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

exports.jwtVerify = function (req, res, next) {
  let accessToken = req.cookies.accessToken;

  if (!accessToken) {
    const error = new Error('Token not found');
    error.statusCode = 403;
    throw error;
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(accessToken, JWT_SECRET);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  req.email = decodedToken.email;

  next();
};
