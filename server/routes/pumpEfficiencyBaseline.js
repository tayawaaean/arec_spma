const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/pumpEfficiencyBaselineController');
const { updateBaselineValidator } = require('../validators/pumpEfficiencyBaselineValidator');
const { validationResult } = require('express-validator');

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Get current user's pump efficiency baseline
router.get('/me', auth, controller.getBaseline);

// Update current user's pump efficiency baseline
router.put('/me', auth, updateBaselineValidator, handleValidationErrors, controller.updateBaseline);

module.exports = router;