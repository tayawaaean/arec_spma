const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Add rate limiting to auth endpoints to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { message: 'Too many login or registration attempts from this IP, please try again later.' }
});

// Registration route (rate limited)
router.post('/register', authLimiter, authController.register);

// Public login route (rate limited)
router.post('/login', authLimiter, authController.login);

// Example protected route
router.get('/me', auth, authController.protected);

module.exports = router;