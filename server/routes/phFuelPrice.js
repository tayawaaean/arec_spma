const express = require('express');
const router = express.Router();
const controller = require('../controllers/phFuelPriceController');
const auth = require('../middleware/auth');

router.get('/philippines', auth, controller.getPhilippinesFuelPricesInPhp);

module.exports = router;