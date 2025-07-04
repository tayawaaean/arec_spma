const express = require('express');
const router = express.Router();
const pumpDataController = require('../controllers/pumpDataController');
const auth = require('../middleware/auth');
const { getPumpDataValidator } = require('../validators/pumpDataValidator');
const { validationResult } = require('express-validator');

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// If you want all authenticated users to view pump data:
router.get('/:solarPumpNumber', auth, getPumpDataValidator, handleValidationErrors, pumpDataController.getPumpDataByNumber);

module.exports = router;