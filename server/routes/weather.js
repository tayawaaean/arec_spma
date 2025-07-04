const express = require('express');
const router = express.Router();
const Pump = require('../models/Pump');
const { getCurrentWeatherByCoords } = require('../services/weatherService');
const auth = require('../middleware/auth'); // optional: protect route

// GET /api/weather/:pumpId
router.get('/:pumpId', auth, async (req, res, next) => {
  try {
    const pump = await Pump.findById(req.params.pumpId);
    if (!pump) return res.status(404).json({ error: 'Pump not found' });

    const weather = await getCurrentWeatherByCoords(pump.lat, pump.lng);
    res.json(weather);
  } catch (err) {
    next(err);
  }
});

module.exports = router;