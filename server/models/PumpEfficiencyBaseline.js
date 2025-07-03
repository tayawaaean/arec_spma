const mongoose = require('mongoose');

const PumpEfficiencyBaselineSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  gasoline_kwh_per_1000l: { type: Number, default: 2.5 },
  diesel_kwh_per_1000l: { type: Number, default: 1.8 },
  electric_kwh_per_1000l: { type: Number, default: 1.2 }
});

module.exports = mongoose.model('PumpEfficiencyBaseline', PumpEfficiencyBaselineSchema);