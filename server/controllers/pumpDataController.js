const PumpData = require('../models/PumpData');

exports.getPumpDataByNumber = async (req, res, next) => {
  const { solarPumpNumber } = req.params;
  const { page = 1, limit = 100 } = req.query;
  try {
    const query = { pump: solarPumpNumber };
    const data = await PumpData.find(query)
      .sort({ time: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await PumpData.countDocuments(query);

    res.json({
      data,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    next(err);
  }
};