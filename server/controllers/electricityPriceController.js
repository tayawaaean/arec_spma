const ElectricityPrice = require('../models/ElectricityPrice');

// Get the authenticated user's electricity price
exports.getMyPrice = async (req, res, next) => {
  try {
    let priceDoc = await ElectricityPrice.findOne({ user: req.user._id });
    if (!priceDoc) {
      // If not set, create a default one
      priceDoc = await ElectricityPrice.create({ user: req.user._id });
    }
    res.json({ pricePerKwh: priceDoc.pricePerKwh });
  } catch (err) {
    next(err);
  }
};

// Update the authenticated user's electricity price
exports.updateMyPrice = async (req, res, next) => {
  try {
    const { pricePerKwh } = req.body;
    if (typeof pricePerKwh !== 'number' || pricePerKwh <= 0) {
      return res.status(400).json({ message: 'pricePerKwh must be a positive number.' });
    }
    let priceDoc = await ElectricityPrice.findOneAndUpdate(
      { user: req.user._id },
      { pricePerKwh },
      { new: true, upsert: true }
    );
    res.json({ pricePerKwh: priceDoc.pricePerKwh });
  } catch (err) {
    next(err);
  }
};