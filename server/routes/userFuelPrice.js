const express = require('express');
const router = express.Router();
const controller = require('../controllers/userFuelPriceController');
const auth = require('../middleware/auth');

// Get current user's gasoline and diesel price in PHP
router.get('/me', auth, controller.getMyFuelPrices);

// Update current user's gasoline and/or diesel price in PHP
router.put('/me', auth, controller.updateMyFuelPrices);

// Reset to latest API value (default)
router.put('/me/reset', auth, controller.resetMyFuelPrices);

module.exports = router;