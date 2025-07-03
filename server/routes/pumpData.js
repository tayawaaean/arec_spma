const express = require('express');
const router = express.Router();
const pumpDataController = require('../controllers/pumpDataController');

// GET /api/pumpdata/:solarPumpNumber
router.get('/:solarPumpNumber', pumpDataController.getPumpDataByNumber);

module.exports = router;