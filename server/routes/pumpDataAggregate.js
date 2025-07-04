const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const aggregateController = require('../controllers/pumpDataAggregateController');
const { aggregatePumpDataValidator } = require('../validators/pumpDataAggregateValidator');
const { validationResult } = require('express-validator');

// Middleware to handle validation errors
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Aggregated data for a pump by interval and date range, with summary and max/min values
// Example: GET /api/pump-data/aggregate/1?interval=daily&start=2025-07-01&end=2025-07-03
router.get(
  '/aggregate/:solarPumpNumber',
  auth,
  authorize('admin', 'superadmin'),
  aggregatePumpDataValidator,
  handleValidationErrors,
  aggregateController.aggregatePumpData
);

module.exports = router;