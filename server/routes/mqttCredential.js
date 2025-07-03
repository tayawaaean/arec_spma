const express = require('express');
const router = express.Router();
const controller = require('../controllers/mqttCredentialController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Only superadmin can manage MQTT credentials
router.post('/update', auth, authorize('superadmin'), controller.update);
router.post('/default', auth, authorize('superadmin'), controller.useDefault);
router.get('/', auth, authorize('superadmin'), controller.get);

module.exports = router;