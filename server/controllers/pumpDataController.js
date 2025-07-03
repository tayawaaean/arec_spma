const PumpData = require('../models/PumpData');

exports.getPumpDataByNumber = async (req, res, next) => {
  const { solarPumpNumber } = req.params;
  try {
    const data = await PumpData.find({ pump: solarPumpNumber }).sort({ time: -1 });
    res.json(data);
  } catch (err) {
    next(err);
  }
};