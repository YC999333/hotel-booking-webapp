const { validationResult } = require('express-validator');
require('dotenv').config();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  let userStatus = '';

  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { email, password, username } = req.body;

    const hashPassword = await bcrypt.hash(password, 12);

    if (email === 'admin@admin.com') {
      userStatus = 'admin';
    } else {
      userStatus = 'user';
    }

    const user = new User({
      email,
      username,
      password: hashPassword,
      userStatus,
    });

    const result = await user.save();

    res.status(201).json({ message: 'User created', userId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err); //reach next error handling
  }
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { email, password, confirmPassword } = req.body;

    let loggedInUser;

    if (password !== confirmPassword) {
      const error = new Error('Password not matched!');
      error.statusCode = 401;
      throw error;
    }
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 401;
      throw error;
    }

    loggedInUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }

    let userAuth = false;
    let adminAuth = false;

    if (user.userStatus === 'user') {
      userAuth = true;
    }

    if (user.userStatus === 'admin') {
      adminAuth = true;
    }

    res.status(200).json({
      message: 'Logged in successfully',
      userId: loggedInUser._id.toString(),
      adminAuth,
      userAuth,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.logout = (req, res, next) => {
  let userAuth = false;
  let adminAuth = false;

  res
    .status(200)
    .clearCookie('accessToken')
    .json({ message: 'Log out successfully', userAuth, adminAuth });
};
