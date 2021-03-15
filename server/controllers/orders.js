const User = require('../models/user');
const Hotel = require('../models/hotel');
const Order = require('../models/order');
const { DateTime } = require('luxon');
const mongoose = require('mongoose');

exports.getOrders = async (req, res, next) => {
  let userEmail = req.email;

  try {
    if (!req.email) {
      const error = new Error('Token not found');
      error.statusCode = 401;
      throw error;
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 401;
      throw error;
    }

    let username = user.username;

    const userOrders = await Order.find({
      reservations: {
        $elemMatch: {
          username,
        },
      },
    });

    if (userOrders.length <= 0) {
      res.status(404).json({ message: 'No Orders' });
    } else {
      res.status(200).json({ message: 'get orders successully', userOrders });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.bookDate = async (req, res, next) => {
  const { start, end, hotelId } = req.body;
  let userEmail = req.email;

  let reservations = {};

  try {
    if (!start || !end || start === end) {
      const error = new Error('Make sure you pick the date correctly');
      error.statusCode = 401;
      throw error;
    }

    if (!req.email) {
      const error = new Error('Token not found');
      error.statusCode = 401;
      throw error;
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 401;
      throw error;
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      const error = new Error('Hotel not found');
      error.statusCode = 401;
      throw error;
    }

    const reservedDoc = await Hotel.find({
      _id: hotelId,
      reservations: {
        $elemMatch: {
          start: { $lt: new Date(end) },
          end: { $gte: new Date(start) },
        },
      },
    });

    if (reservedDoc.length > 0) {
      res.status(404).json({
        message: 'Room not available on the dates you pick. Pick another date.',
      });
    } else {
      const diff = DateTime.fromISO(end).diff(DateTime.fromISO(start), [
        'days',
      ]);
      const nights = diff.days;

      reservations.start = start;
      reservations.end = end;
      reservations.title = hotel.title;
      reservations.username = user.username;
      reservations.price = hotel.price;
      reservations.nights = nights;
      const total = nights * hotel.price;
      reservations.total = total;

      hotel.reservations.push(reservations);
      await hotel.save();

      const order = new Order({
        reservations: hotel.reservations,
        user: user.username,
      });

      const result = await order.save();

      res.status(200).json({
        message: 'Book successully',
        date: { start, end },
        user: user.username,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteReservation = async (req, res, next) => {
  const id = req.params.id;

  try {
    const hotel = await Hotel.findOne({ 'reservations._id': id });

    await Hotel.updateOne(
      { _id: hotel._id },
      { $pull: { reservations: { _id: id } } }
    );

    const order = await Order.findOne({ 'reservations._id': id });

    await Order.updateOne(
      { _id: order._id },
      { $pull: { reservations: { _id: id } } }
    );

    res.status(200).json({ message: 'Reservation deleted' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
