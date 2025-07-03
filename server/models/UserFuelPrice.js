const mongoose = require('mongoose');

const userFuelPriceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  gasolinePrice: { type: Number }, // in PHP
  dieselPrice: { type: Number }    // in PHP
});

module.exports = mongoose.model('UserFuelPrice', userFuelPriceSchema);