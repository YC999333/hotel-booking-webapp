const User = require('../models/user');

exports.load = async (req, res, next) => {
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

    let userAuth = false;
    let adminAuth = false;

    if (user.userStatus === 'user') {
      userAuth = true;
    }

    if (user.userStatus === 'admin') {
      adminAuth = true;
    }

    res.status(200).json({ message: 'get cookies', userAuth, adminAuth, user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
