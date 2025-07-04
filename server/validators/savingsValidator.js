const { query } = require('express-validator');

const savingsQueryValidator = [
  query('start')
    .optional()
    .isISO8601()
    .withMessage('start must be a valid ISO8601 date'),
  query('end')
    .optional()
    .isISO8601()
    .withMessage('end must be a valid ISO8601 date'),
  query('interval')
    .optional()
    .isIn(['hourly', 'daily', 'weekly', 'monthly'])
    .withMessage('interval must be one of: hourly, daily, weekly, monthly')
];

module.exports = { savingsQueryValidator };