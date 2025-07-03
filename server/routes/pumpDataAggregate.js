const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const aggregateController = require('../controllers/pumpDataAggregateController');

// Aggregated data for a pump by interval and date range, with summary and max/min values
// Example: GET /api/pump-data/aggregate/1?interval=daily&start=2025-07-01&end=2025-07-03
router.get('/aggregate/:solarPumpNumber', auth, authorize('admin', 'superadmin'), aggregateController.aggregatePumpData);

module.exports = router;