const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/savingsController');

router.get('/breakdown/:solarPumpNumber', auth, controller.getSavingsBreakdown);

module.exports = router;