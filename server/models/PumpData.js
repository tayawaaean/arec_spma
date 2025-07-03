const mongoose = require('mongoose');

const pumpDataSchema = new mongoose.Schema({
  pump: { type: Number, required: true }, // solarPumpNumber
  time: { type: Date, required: true },
  filtered_current: { type: Number, required: true },
  filtered_voltage: { type: Number, required: true },
  flow: { type: Number, required: true },
  power: { type: Number, required: true },
  accumulated_energy_wh: { type: Number, required: true },
  total_water_volume: { type: Number, required: true }
});

module.exports = mongoose.model('PumpData', pumpDataSchema);