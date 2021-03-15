const { validationResult } = require('express-validator');
require('dotenv').config();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const Hotel = require('../models/hotel');

exports.searchAll = async (req, res, next) => {
  try {
    const hotels = await Hotel.find();

    if (!hotels) {
      const error = new Error('Hotel not found');
      error.statusCode = 401;
      throw error;
    }

    res.status(200).json({ message: 'search successully', hotels });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.searchNearBy = async (req, res, next) => {
  try {
    const hotel = await Hotel.find({ location: 'taiwan' });

    if (!hotel) {
      const error = new Error('Hotel not found');
      error.statusCode = 401;
      throw error;
    }

    res.status(200).json({ message: 'search successully', hotel });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.search = async (req, res, next) => {
  const keyword = req.body.search.toLowerCase();

  try {
    const hotel = await Hotel.find({ location: keyword });

    if (!hotel) {
      const error = new Error('Hotel not found');
      error.statusCode = 401;
      throw error;
    }

    res.status(200).json({ message: 'search successully', hotel });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
