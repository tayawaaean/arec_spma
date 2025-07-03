const mongoose = require('mongoose');

const electricityPriceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  pricePerKwh: { type: Number, default: 10 }
});

module.exports = mongoose.model('ElectricityPrice', electricityPriceSchema);