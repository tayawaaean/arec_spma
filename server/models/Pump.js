const mongoose = require('mongoose');

const pumpSchema = new mongoose.Schema({
  solarPumpNumber: { type: Number, required: true, unique: true }, // Non-editable, auto-incremented
  model: { type: String, required: true },
  power: { type: String, required: true },
  acInputVoltage: { type: String, required: true },
  pvOperatingVoltage: { type: String, required: true },
  openCircuitVoltage: { type: String, required: true },
  outlet: { type: String, required: true },
  maxHead: { type: String, required: true },
  maxFlow: { type: String, required: true },
  solarPanelConfig: { type: String, required: true },
  image: { type: String },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  timeInstalled: { type: Date, required: true },
  status: {
    type: String,
    enum: ['active', 'inactive', 'warning'],
    default: 'active',
    required: true
  },
  createdBy: { type: String, required: true },
  updatedBy: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Pump', pumpSchema);