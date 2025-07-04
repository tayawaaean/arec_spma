const { body } = require('express-validator');

const createPumpValidator = [
  body('solarPumpNumber')
    .isInt({ min: 1 })
    .withMessage('solarPumpNumber must be a positive integer'),
  body('model')
    .notEmpty()
    .withMessage('model is required'),
  body('power')
    .notEmpty()
    .withMessage('power is required'),
  body('acInputVoltage')
    .notEmpty()
    .withMessage('acInputVoltage is required'),
  body('pvOperatingVoltage')
    .notEmpty()
    .withMessage('pvOperatingVoltage is required'),
  body('openCircuitVoltage')
    .notEmpty()
    .withMessage('openCircuitVoltage is required'),
  body('outlet')
    .notEmpty()
    .withMessage('outlet is required'),
  body('maxHead')
    .notEmpty()
    .withMessage('maxHead is required'),
  body('maxFlow')
    .notEmpty()
    .withMessage('maxFlow is required'),
  body('solarPanelConfig')
    .notEmpty()
    .withMessage('solarPanelConfig is required'),
  body('lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('lat must be a valid latitude'),
  body('lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('lng must be a valid longitude'),
  // Optional fields
  body('image').optional().isString(),
  body('timeInstalled').optional().isISO8601().withMessage('timeInstalled must be a valid ISO date'),
  body('status').optional().isIn(['active', 'inactive', 'maintenance']).withMessage('Invalid status'),
  body('address').optional().isObject()
];

const updatePumpValidator = [
  body('solarPumpNumber')
    .optional()
    .isInt({ min: 1 })
    .withMessage('solarPumpNumber must be a positive integer'),
  body('model')
    .optional()
    .notEmpty()
    .withMessage('model is required'),
  body('power')
    .optional()
    .notEmpty()
    .withMessage('power is required'),
  body('lat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('lat must be a valid latitude'),
  body('lng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('lng must be a valid longitude'),
  // Add further optional validators as above for other fields
];

module.exports = {
  createPumpValidator,
  updatePumpValidator,
};