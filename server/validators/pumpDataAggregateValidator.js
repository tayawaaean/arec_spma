const { param, query } = require('express-validator');

const aggregatePumpDataValidator = [
  param('solarPumpNumber')
    .isInt({ min: 1 })
    .withMessage('solarPumpNumber must be a positive integer'),

  query('interval')
    .optional()
    .isIn(['hourly', 'daily', 'weekly', 'monthly', 'custom'])
    .withMessage('interval must be one of: hourly, daily, weekly, monthly, custom'),

  query('start')
    .optional()
    .isISO8601()
    .withMessage('start must be a valid ISO8601 date'),

  query('end')
    .optional()
    .isISO8601()
    .withMessage('end must be a valid ISO8601 date')
];

module.exports = { aggregatePumpDataValidator };