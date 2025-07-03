const mongoose = require('mongoose');

const deviceStatusSchema = new mongoose.Schema({
  pump: { type: Number, required: true, unique: true }, // solarPumpNumber, unique per device
  status: { type: String, enum: ['online', 'offline'], required: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DeviceStatus', deviceStatusSchema);