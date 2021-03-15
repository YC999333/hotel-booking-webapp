const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const User = require('../models/user');
const searchController = require('../controllers/search');
const { jwtVerify } = require('../middleware/jwtVerify');
const { setCookie } = require('../middleware/setCookie');

router.post('/nearby', searchController.searchNearBy);

router.post('/', searchController.search);

router.get('/all', searchController.searchAll);

module.exports = router;
