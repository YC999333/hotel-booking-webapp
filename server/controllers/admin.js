const { validationResult } = require('express-validator');
require('dotenv').config();
const User = require('../models/user');
const Hotel = require('../models/hotel');

exports.addHotel = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { title, location, imageUrl, price, description } = req.body;

    const hotel = new Hotel({
      title: title.toLowerCase(),
      location: location.toLowerCase(),
      imageUrl,
      price,
      description,
    });

    const result = await hotel.save();

    res.status(201).json({ message: 'Hotel created', hotelId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.editHotel = async (req, res, next) => {
  const { title, location, imageUrl, price, description, hotelId } = req.body;
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      const error = new Error('Hotel not found');
      error.statusCode = 401;
      throw error;
    }

    hotel.title = title;
    hotel.location = location;
    hotel.imageUrl = imageUrl;
    hotel.price = price;
    hotel.description = description;

    const result = await hotel.save();

    res.status(201).json({ message: 'Hotel created', hotel: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getHotelInfo = async (req, res, next) => {
  const hotelId = req.params.hotelId;

  try {
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      const error = new Error('Hotel not found');
      error.statusCode = 401;
      throw error;
    }

    res.status(201).json({ message: 'Hotel created', hotelInfo: hotel });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteHotel = async (req, res, next) => {
  const hotelId = req.params.hotelId;

  try {
    const result = await Hotel.findByIdAndRemove(hotelId);

    res.status(200).json({ message: 'Hotel deleted' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
