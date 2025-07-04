const express = require('express');
const router = express.Router();
const Pump = require('../models/Pump');
const auth = require('../middleware/auth'); // If you want to protect this route

// GET /api/pump-map
router.get('/', auth, async (req, res, next) => {
  try {
    const pumps = await Pump.find({}, 'solarPumpNumber model lat lng status'); // Only fetch needed fields
    res.json(pumps);
  } catch (err) {
    next(err);
  }
});

module.exports = router;