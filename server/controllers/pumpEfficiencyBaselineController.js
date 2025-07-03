const PumpEfficiencyBaseline = require('../models/PumpEfficiencyBaseline');

// GET current user's baseline (creates with default if missing)
exports.getBaseline = async (req, res, next) => {
  try {
    let doc = await PumpEfficiencyBaseline.findOne({ user: req.user._id });
    if (!doc) {
      doc = await PumpEfficiencyBaseline.create({ user: req.user._id });
    }
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

// PUT update current user's baseline
exports.updateBaseline = async (req, res, next) => {
  try {
    const updates = {};
    if (typeof req.body.gasoline_kwh_per_1000l === 'number') updates.gasoline_kwh_per_1000l = req.body.gasoline_kwh_per_1000l;
    if (typeof req.body.diesel_kwh_per_1000l === 'number') updates.diesel_kwh_per_1000l = req.body.diesel_kwh_per_1000l;
    if (typeof req.body.electric_kwh_per_1000l === 'number') updates.electric_kwh_per_1000l = req.body.electric_kwh_per_1000l;

    const doc = await PumpEfficiencyBaseline.findOneAndUpdate(
      { user: req.user._id },
      { $set: updates },
      { new: true, upsert: true }
    );
    res.json(doc);
  } catch (err) {
    next(err);
  }
};