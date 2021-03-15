require('dotenv').config();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.setCookie = async (req, res, next) => {
  const { email } = req.body;
  let expiration = '2h';
  const token = jwt.sign(
    {
      email: email,
    },
    JWT_SECRET,
    { expiresIn: expiration }
  );

  res.status(200).cookie('accessToken', token, {
    path: '/',
    httpOnly: true,
    maxAge: 7200000,
  });
  next();
};
