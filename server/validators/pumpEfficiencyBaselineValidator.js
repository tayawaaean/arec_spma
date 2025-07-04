const { body } = require('express-validator');

const updateBaselineValidator = [
  body('efficiency')
    .exists().withMessage('efficiency is required')
    .isFloat({ min: 0, max: 100 })
    .withMessage('efficiency must be a number between 0 and 100'),
  body('referenceFlow')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('referenceFlow must be a positive number'),
  body('referencePower')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('referencePower must be a positive number'),
  // Add more fields as needed based on your model
];

module.exports = { updateBaselineValidator };