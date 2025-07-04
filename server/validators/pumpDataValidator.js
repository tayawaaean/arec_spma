const { param } = require('express-validator');

const getPumpDataValidator = [
  param('solarPumpNumber')
    .isInt({ min: 1 })
    .withMessage('solarPumpNumber must be a positive integer')
];

module.exports = { getPumpDataValidator };