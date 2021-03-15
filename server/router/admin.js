const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const User = require('../models/user');
const adminController = require('../controllers/admin');
const { jwtVerify } = require('../middleware/jwtVerify');

router.put(
  '/',
  [
    body('title').isLength({ min: 2 }).trim().withMessage('Invalid title!'),
    body('location').isLength({ min: 2 }).withMessage('Invalid location'),
    body('imageUrl').isLength({ min: 5 }).trim().withMessage('Invalid URL'),
    body('price').isInt({ gt: 3 }),
    body('imageUrl').isLength({ min: 5 }).trim().withMessage('Invalid URL'),
  ],
  jwtVerify,
  adminController.addHotel
);

router.get('/edit/:hotelId', jwtVerify, adminController.getHotelInfo);

router.put(
  '/edit/:hotelId',
  [
    body('title').isLength({ min: 2 }).trim().withMessage('Invalid title!'),
    body('location').isLength({ min: 2 }).withMessage('Invalid location'),
    body('imageUrl').isLength({ min: 5 }).trim().withMessage('Invalid URL'),
    body('price').isInt({ gt: 3 }),
    body('imageUrl').isLength({ min: 5 }).trim().withMessage('Invalid URL'),
    body('hotelId'),
  ],
  jwtVerify,
  adminController.editHotel
);

router.delete('/delete/:hotelId', jwtVerify, adminController.deleteHotel);

module.exports = router;
