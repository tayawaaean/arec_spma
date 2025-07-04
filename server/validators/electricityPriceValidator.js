const { body } = require('express-validator');

const updateElectricityPriceValidator = [
  body('pricePerKwh')
    .exists()
    .withMessage('pricePerKwh is required')
    .isFloat({ min: 0 })
    .withMessage('pricePerKwh must be a positive number')
];

module.exports = { updateElectricityPriceValidator };