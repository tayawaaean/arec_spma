const express = require('express');
const router = express.Router();
const controller = require('../controllers/electricityPriceController');
const auth = require('../middleware/auth');
const { updateElectricityPriceValidator } = require('../validators/electricityPriceValidator');
const { validationResult } = require('express-validator');

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Get current user's price
router.get('/me', auth, controller.getMyPrice);

// Update current user's price
router.put('/me', auth, updateElectricityPriceValidator, handleValidationErrors, controller.updateMyPrice);

module.exports = router;