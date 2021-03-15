const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const User = require('../models/user');
const authController = require('../controllers/auth');
const loadController = require('../controllers/load');
const { jwtVerify } = require('../middleware/jwtVerify');
const { setCookie } = require('../middleware/setCookie');

router.get('/check-user', jwtVerify, loadController.load);

router.put(
  '/signup',
  [
    body('username')
      .isLength({ min: 2 })
      .trim()
      .withMessage('Invalid username!'),
    body('email')
      .isEmail()
      .withMessage('Invalid Email')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject('Email exists!');
          }
        });
      })
      .normalizeEmail(),

    body('password')
      .isLength({ min: 5 })
      .trim()
      .withMessage('Invalid password. Must be more than 5 characters'),
  ],
  authController.signup
);

router.post(
  '/signin',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid Email')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (!userDoc) {
            return Promise.reject('User not found');
          }
        });
      })
      .normalizeEmail(),

    body('password')
      .isLength({ min: 5 })
      .trim()
      .withMessage('Invalid password'),
  ],
  setCookie,
  authController.login
);

router.get('/signout', authController.logout);

module.exports = router;
