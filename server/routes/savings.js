const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { savingsQueryValidator } = require('../validators/savingsValidator');
const savingsController = require('../controllers/savingsController');
const { validationResult } = require('express-validator');

router.get(
  '/:solarPumpNumber/breakdown',
  auth,
  savingsQueryValidator,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  savingsController.getSavingsBreakdown
);

module.exports = router;