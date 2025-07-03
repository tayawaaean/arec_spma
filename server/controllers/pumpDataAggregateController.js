const PumpData = require('../models/PumpData');

exports.aggregatePumpData = async (req, res, next) => {
  try {
    const { solarPumpNumber } = req.params;
    const { interval = 'daily', start, end } = req.query;

    const match = { pump: Number(solarPumpNumber) };
    if (start || end) {
      match.time = {};
      if (start) match.time.$gte = new Date(start);
      if (end) match.time.$lte = new Date(end);
    }

    let groupId = null;
    switch (interval) {
      case 'hourly':
        groupId = { $dateToString: { format: '%Y-%m-%dT%H:00:00Z', date: '$time' } };
        break;
      case 'daily':
        groupId = { $dateToString: { format: '%Y-%m-%d', date: '$time' } };
        break;
      case 'weekly':
        groupId = {
          $concat: [
            { $toString: { $isoWeekYear: '$time' } },
            '-W',
            { $toString: { $isoWeek: '$time' } }
          ]
        };
        break;
      case 'monthly':
        groupId = { $dateToString: { format: '%Y-%m', date: '$time' } };
        break;
      case 'custom':
        groupId = null;
        break;
      default:
        return res.status(400).json({ message: 'Invalid interval specified.' });
    }

    const groupStage = groupId
      ? {
          $group: {
            _id: groupId,
            avg_current: { $avg: '$filtered_current' },
            min_current: { $min: '$filtered_current' },
            max_current: { $max: '$filtered_current' },
            avg_voltage: { $avg: '$filtered_voltage' },
            min_voltage: { $min: '$filtered_voltage' },
            max_voltage: { $max: '$filtered_voltage' },
            avg_power: { $avg: '$power' },
            min_power: { $min: '$power' },
            max_power: { $max: '$power' },
            total_flow: { $sum: '$flow' },
            min_flow: { $min: '$flow' },
            max_flow: { $max: '$flow' },
            total_energy_wh: { $sum: '$accumulated_energy_wh' },
            min_energy_wh: { $min: '$accumulated_energy_wh' },
            max_energy_wh: { $max: '$accumulated_energy_wh' },
            total_water_volume: { $sum: '$total_water_volume' },
            min_water_volume: { $min: '$total_water_volume' },
            max_water_volume: { $max: '$total_water_volume' },
            count: { $sum: 1 },
            first: { $min: '$time' },
            last: { $max: '$time' }
          }
        }
      : null;

    // Summary for all filtered data (totals, max, min, avg)
    const summaryGroupStage = {
      $group: {
        _id: null,
        avg_current: { $avg: '$filtered_current' },
        min_current: { $min: '$filtered_current' },
        max_current: { $max: '$filtered_current' },
        avg_voltage: { $avg: '$filtered_voltage' },
        min_voltage: { $min: '$filtered_voltage' },
        max_voltage: { $max: '$filtered_voltage' },
        avg_power: { $avg: '$power' },
        min_power: { $min: '$power' },
        max_power: { $max: '$power' },
        total_flow: { $sum: '$flow' },
        min_flow: { $min: '$flow' },
        max_flow: { $max: '$flow' },
        total_energy_wh: { $sum: '$accumulated_energy_wh' },
        min_energy_wh: { $min: '$accumulated_energy_wh' },
        max_energy_wh: { $max: '$accumulated_energy_wh' },
        total_water_volume: { $sum: '$total_water_volume' },
        min_water_volume: { $min: '$total_water_volume' },
        max_water_volume: { $max: '$total_water_volume' },
        count: { $sum: 1 }
      }
    };

    // Run both aggregations in parallel
    const [intervalData, summary] = await Promise.all([
      PumpData.aggregate([
        { $match: match },
        ...(groupStage ? [groupStage] : []),
        { $sort: { _id: 1 } }
      ]),
      PumpData.aggregate([
        { $match: match },
        summaryGroupStage
      ])
    ]);

    res.json({
      intervalData,
      summary: summary[0] || {}
    });
  } catch (err) {
    next(err);
  }
};