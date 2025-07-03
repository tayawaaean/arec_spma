const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { body } = require('express-validator');

// Validation for user creation and update
const userValidation = [
  body('username').isString().isLength({ min: 3 }),
  body('password').isString().isLength({ min: 6 }),
  body('userType').optional().isIn(['superadmin', 'admin', 'user'])
];

// Superadmin-only endpoints
router.post('/', auth, authorize('superadmin'), userValidation, userController.createUser);
router.put('/:id', auth, authorize('superadmin'), userValidation, userController.editUser);
router.delete('/:id', auth, authorize('superadmin'), userController.deleteUser);
router.get('/', auth, authorize('superadmin'), userController.listUsers); // optional

// Change password (all authenticated users)
router.post('/change-password', auth, [
  body('password').isString().isLength({ min: 6 })
], userController.changePassword);

module.exports = router;