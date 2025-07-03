const express = require('express');
const router = express.Router();
const exchangeRateController = require('../controllers/exchangeRateController');
const auth = require('../middleware/auth');

router.get('/usd-php', auth, exchangeRateController.getUsdToPhpRate);

module.exports = router;