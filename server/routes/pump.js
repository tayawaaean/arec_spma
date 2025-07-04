const express = require('express');
const router = express.Router();
const { createPumpValidator, updatePumpValidator } = require('../validators/pumpValidator');
const { validationResult } = require('express-validator');
const pumpController = require('../controllers/pumpController');
const auth = require('../middleware/auth');

// Helper middleware to return validation errors
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Add a new pump (admin/superadmin)
router.post(
  '/',
  auth,
  createPumpValidator,
  handleValidationErrors,
  pumpController.addPump
);

// Edit pump (admin/superadmin)
router.put(
  '/:id',
  auth,
  updatePumpValidator,
  handleValidationErrors,
  pumpController.editPump
);

module.exports = router;