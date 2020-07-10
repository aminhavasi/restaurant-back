const express = require('express');
const router = express.Router();
//auth
const auth = require('./auth');
router.use('/api/auth', auth);

module.exports = router;
