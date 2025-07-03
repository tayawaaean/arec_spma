const express = require('express');
const router = express.Router();
const controller = require('../controllers/electricityPriceController');
const auth = require('../middleware/auth'); // <-- ensure this attaches req.user

// Get current user's price
router.get('/me', auth, controller.getMyPrice);

// Update current user's price
router.put('/me', auth, controller.updateMyPrice);

module.exports = router;