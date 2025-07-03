const express = require('express');
const router = express.Router();
const DeviceStatus = require('../models/DeviceStatus');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Only authenticated users with admin/superadmin can access device status
router.get('/:pump', auth, authorize('admin', 'superadmin'), async (req, res, next) => {
  try {
    const status = await DeviceStatus.findOne({ pump: req.params.pump });
    if (!status) return res.status(404).json({ message: 'Status not found' });
    res.json(status);
  } catch (err) {
    next(err);
  }
});

module.exports = router;