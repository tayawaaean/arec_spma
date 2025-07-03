const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/pumpEfficiencyBaselineController');

// Get current user's pump efficiency baseline
router.get('/me', auth, controller.getBaseline);

// Update current user's pump efficiency baseline
router.put('/me', auth, controller.updateBaseline);

module.exports = router;