const express = require('express');
const router = express.Router();
const auth = require('./auth');
const menu = require('./menu');

//auth
router.use('/api/auth', auth);

//menu
router.use('/api/menu', menu);

module.exports = router;
