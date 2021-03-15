const express = require('express');
const router = express.Router();
const User = require('../models/user');
const orderController = require('../controllers/orders');
const { jwtVerify } = require('../middleware/jwtVerify');

router.get('/get-orders', jwtVerify, orderController.getOrders);

router.post('/book', jwtVerify, orderController.bookDate);

router.delete(
  '/orders/delete/:id',
  jwtVerify,
  orderController.deleteReservation
);

module.exports = router;
