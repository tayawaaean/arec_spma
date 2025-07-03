const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Registration route
router.post('/register', authController.register);

// Public login route
router.post('/login', authController.login);

// Example protected route
router.get('/me', auth, authController.protected);

module.exports = router;