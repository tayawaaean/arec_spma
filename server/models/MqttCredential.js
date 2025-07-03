const mongoose = require('mongoose');

const mqttCredentialSchema = new mongoose.Schema({
  brokerUrl: { type: String, required: true },
  username: { type: String, required: true }, // encrypted
  password: { type: String, required: true }, // encrypted
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MqttCredential', mqttCredentialSchema);