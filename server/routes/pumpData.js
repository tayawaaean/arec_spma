const express = require('express');
const router = express.Router();
const pumpDataController = require('../controllers/pumpDataController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Only authenticated users with admin/superadmin can access pump data
router.get('/:solarPumpNumber', auth, authorize('admin', 'superadmin'), pumpDataController.getPumpDataByNumber);

module.exports = router;