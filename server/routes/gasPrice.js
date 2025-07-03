const express = require('express');
const router = express.Router();
const gasPriceController = require('../controllers/gasPriceController');
const auth = require('../middleware/auth');

// All endpoints are protected by auth and open to all user types
router.get('/diesel/philippines', auth, gasPriceController.getPhilippinesDieselPrice);
router.get('/gasoline/philippines', auth, gasPriceController.getPhilippinesGasolinePrice);

module.exports = router;