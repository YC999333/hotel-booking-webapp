const express = require('express');
require('dotenv').config();
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;
const authRoutes = require('./router/auth');
const searchRoutes = require('./router/search');
const adminRoutes = require('./router/admin');
const orderRoutes = require('./router/order');

app.use(express.static(__dirname + '/html'));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/search', searchRoutes);
app.use('/admin', adminRoutes);
app.use('/', orderRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  let message = '';
  if (error.data) {
    message = error.data[0].msg;
  } else {
    message = error.message;
  }

  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'html/index.html'), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    const port = process.env.PORT;
    app.listen(port || 5000);
    console.log('Connected');
  })
  .catch((err) => console.log(err));
