const PumpData = require('../models/PumpData');
const PumpEfficiencyBaseline = require('../models/PumpEfficiencyBaseline');
const UserFuelPrice = require('../models/UserFuelPrice');
const ElectricityPrice = require('../models/ElectricityPrice');

// Utility: get user efficiency baseline (create with defaults if missing)
async function getUserBaseline(userId) {
  let baseline = await PumpEfficiencyBaseline.findOne({ user: userId });
  if (!baseline) {
    baseline = await PumpEfficiencyBaseline.create({ user: userId });
  }
  return baseline;
}

exports.getSavingsBreakdown = async (req, res, next) => {
  try {
    const { solarPumpNumber } = req.params;
    const { start, end, interval = 'daily' } = req.query;

    // 1. Get user baseline values
    const baseline = await getUserBaseline(req.user._id);

    // 2. Get fuel and electricity prices for user
    const [fuel, elec] = await Promise.all([
      UserFuelPrice.findOne({ user: req.user._id }),
      ElectricityPrice.findOne({ user: req.user._id })
    ]);
    const gasoline_price = fuel?.gasolinePrice ?? 75;
    const diesel_price = fuel?.dieselPrice ?? 65;
    const elec_price = elec?.pricePerKwh ?? 10;

    // 3. Aggregate PumpData by interval
    const match = { pump: Number(solarPumpNumber) };
    if (start || end) {
      match.time = {};
      if (start) match.time.$gte = new Date(start);
      if (end) match.time.$lte = new Date(end);
    }

    let groupId;
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
      default:
        groupId = null; // no grouping
    }

    const pipeline = [
      { $match: match },
      ...(groupId
        ? [{
            $group: {
              _id: groupId,
              total_water_volume: { $sum: '$total_water_volume' },
              total_energy_wh: { $sum: '$accumulated_energy_wh' }
            }
          }]
        : [{
            $group: {
              _id: null,
              total_water_volume: { $sum: '$total_water_volume' },
              total_energy_wh: { $sum: '$accumulated_energy_wh' }
            }
          }]),
      { $sort: { _id: 1 } }
    ];

    const agg = await PumpData.aggregate(pipeline);

    // 4. Calculate savings for each interval bucket
    const baseline_solar_kwh_per_1000l = 0.1;
    const result = agg.map(bucket => {
      const water_l = bucket.total_water_volume || 0;
      const solar_kwh_used = (bucket.total_energy_wh || 0) / 1000;
      const volume_units = water_l / 1000;

      // Baseline consumptions
      const gasoline_kwh = volume_units * baseline.gasoline_kwh_per_1000l;
      const diesel_kwh = volume_units * baseline.diesel_kwh_per_1000l;
      const electric_kwh = volume_units * baseline.electric_kwh_per_1000l;
      const solar_baseline_kwh = volume_units * baseline_solar_kwh_per_1000l;

      // Costs
      const solar_cost = solar_baseline_kwh * elec_price;
      const gasoline_cost = gasoline_kwh * gasoline_price;
      const diesel_cost = diesel_kwh * diesel_price;
      const electric_cost = electric_kwh * elec_price;

      // Savings
      return {
        interval: bucket._id,
        water_volume_liters: water_l,
        kwh_used_solar: solar_kwh_used,
        costs: {
          solar_cost,
          gasoline_cost,
          diesel_cost,
          electric_cost
        },
        savings: {
          vs_gasoline: gasoline_cost - solar_cost,
          vs_diesel: diesel_cost - solar_cost,
          vs_electric: electric_cost - solar_cost
        }
      };
    });

    // 5. Summarize totals for all buckets
    const total = result.reduce(
      (acc, x) => {
        acc.total_water_volume += x.water_volume_liters;
        acc.total_kwh_used_solar += x.kwh_used_solar;
        acc.total_solar_cost += x.costs.solar_cost;
        acc.total_gasoline_cost += x.costs.gasoline_cost;
        acc.total_diesel_cost += x.costs.diesel_cost;
        acc.total_electric_cost += x.costs.electric_cost;
        acc.total_savings_vs_gasoline += x.savings.vs_gasoline;
        acc.total_savings_vs_diesel += x.savings.vs_diesel;
        acc.total_savings_vs_electric += x.savings.vs_electric;
        return acc;
      },
      {
        total_water_volume: 0,
        total_kwh_used_solar: 0,
        total_solar_cost: 0,
        total_gasoline_cost: 0,
        total_diesel_cost: 0,
        total_electric_cost: 0,
        total_savings_vs_gasoline: 0,
        total_savings_vs_diesel: 0,
        total_savings_vs_electric: 0
      }
    );

    res.json({
      intervalData: result,
      summary: total,
      baseline: {
        solar_kwh_per_1000l: baseline_solar_kwh_per_1000l,
        gasoline_kwh_per_1000l: baseline.gasoline_kwh_per_1000l,
        diesel_kwh_per_1000l: baseline.diesel_kwh_per_1000l,
        electric_kwh_per_1000l: baseline.electric_kwh_per_1000l
      },
      prices: {
        gasoline_price,
        diesel_price,
        electricity_price: elec_price
      }
    });
  } catch (err) {
    next(err);
  }
};