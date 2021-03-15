const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hotelSchema = new Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
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
});

module.exports = mongoose.model('Hotel', hotelSchema);
