const express = require('express');
const router = express.Router();
const Pump = require('../models/Pump');
const { getPvWattsEstimate } = require('../services/pvwattsService');
const { parseSystemCapacity } = require('../utils/solarConfig');
const { environmentalImpact } = require('../utils/environmentalImpact');
const auth = require('../middleware/auth');

// GET /api/pvwatts/:pumpId
router.get('/:pumpId', auth, async (req, res, next) => {
  try {
    const pump = await Pump.findById(req.params.pumpId);
    if (!pump) return res.status(404).json({ error: 'Pump not found' });

    // Calculate system capacity from solarPanelConfig
    const system_capacity = parseSystemCapacity(pump.solarPanelConfig) || 1; // fallback to 1kW if parsing fails
    const tilt = 18; // fixed as per your requirement

    // Allow optional override via query parameters
    const {
      azimuth = 180,
      array_type = 1,
      module_type = 0,
      losses = 14
    } = req.query;

    // Get PVWatts estimate
    const result = await getPvWattsEstimate({
      lat: pump.lat,
      lon: pump.lng,
      system_capacity,
      tilt,
      azimuth,
      array_type,
      module_type,
      losses
    });

    // Use annual AC output for environmental impact
    const kWh_year = result?.outputs?.ac_annual || 0;

    // Calculate impact for annual and monthly (if available)
    const annualImpact = environmentalImpact(kWh_year);

    let monthlyImpact = [];
    if (Array.isArray(result?.outputs?.ac_monthly)) {
      monthlyImpact = result.outputs.ac_monthly.map((kWh, i) => ({
        month: i + 1,
        kWh,
        ...environmentalImpact(kWh)
      }));
    }

    res.json({
      pump: pump._id,
      lat: pump.lat,
      lng: pump.lng,
      params: {
        system_capacity,
        tilt,
        azimuth,
        array_type,
        module_type,
        losses
      },
      pvwatts: result.outputs,
      environmental_impact: {
        annual: annualImpact,
        monthly: monthlyImpact
      },
      pumpSpecs: {
        model: pump.model,
        solarPanelConfig: pump.solarPanelConfig,
        power: pump.power,
        acInputVoltage: pump.acInputVoltage,
        pvOperatingVoltage: pump.pvOperatingVoltage,
        openCircuitVoltage: pump.openCircuitVoltage,
        outlet: pump.outlet,
        maxHead: pump.maxHead,
        maxFlow: pump.maxFlow,
        address: pump.address,
        timeInstalled: pump.timeInstalled,
        status: pump.status
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;