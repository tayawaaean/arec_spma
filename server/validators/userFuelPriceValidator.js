const { body } = require('express-validator');

const updateFuelPricesValidator = [
  body('gasolinePrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('gasolinePrice must be a positive number'),
  body('dieselPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('dieselPrice must be a positive number')
];

module.exports = { updateFuelPricesValidator };