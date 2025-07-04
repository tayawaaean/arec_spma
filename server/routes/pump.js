const express = require('express');
const router = express.Router();
const pumpController = require('../controllers/pumpController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { body } = require('express-validator');

// Validation for pump creation and update
const pumpValidation = [
  body('solarPumpNumber').isInt({ min: 1 }),
  body('model').isString().notEmpty(),
  body('power').isString().notEmpty(),
  body('acInputVoltage').isString().notEmpty(),
  body('pvOperatingVoltage').isString().notEmpty(),
  body('openCircuitVoltage').isString().notEmpty(),
  body('outlet').isString().notEmpty(),
  body('maxHead').isString().notEmpty(),
  body('maxFlow').isString().notEmpty(),
  body('solarPanelConfig').isString().notEmpty(),
  body('lat').isNumeric(),
  body('lng').isNumeric(),
  body('timeInstalled').isISO8601(),
  body('status').optional().isIn(['active', 'inactive', 'warning']),
  body('image').optional().isString(),
  // Address fields are optional, user can override reverse geocode result
  body('address.barangay').optional().isString(),
  body('address.municipality').optional().isString(),
  body('address.region').optional().isString(),
  body('address.country').optional().isString()
];

// Add a pump (admin/superadmin only)
router.post('/', auth, authorize('admin', 'superadmin'), pumpValidation, pumpController.addPump);

// Edit a pump (admin/superadmin only)
router.put('/:id', auth, authorize('admin', 'superadmin'), pumpValidation, pumpController.editPump);

// Delete a pump (admin/superadmin only)
router.delete('/:id', auth, authorize('admin', 'superadmin'), pumpController.deletePump);

// List all pumps (any authenticated user)
router.get('/', auth, pumpController.listPumps);

// Get a single pump (any authenticated user)
router.get('/:id', auth, pumpController.getPump);

module.exports = router;