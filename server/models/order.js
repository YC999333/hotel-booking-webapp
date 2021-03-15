const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  reservations: [
    {
      start: Date,
      end: Date,
      nights: String,
      title: String,
      price: String,
      total: String,
      username: String,
    },
  ],
  user: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Order', orderSchema);
