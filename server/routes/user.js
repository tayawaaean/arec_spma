const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Superadmin-only endpoints
router.post('/', auth, authorize('superadmin'), userController.createUser);
router.put('/:id', auth, authorize('superadmin'), userController.editUser);
router.delete('/:id', auth, authorize('superadmin'), userController.deleteUser);
router.get('/', auth, authorize('superadmin'), userController.listUsers); // optional

// Change password (all authenticated users)
router.post('/change-password', auth, userController.changePassword);

module.exports = router;