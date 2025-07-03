const MqttCredential = require('../models/MqttCredential');
const { encrypt } = require('../utils/crypto');
const { updateCredentialsAndReconnect, useEnvCredentials } = require('../mqttClient');

// Set new credentials and reconnect (superadmin only)
exports.update = async (req, res, next) => {
  try {
    const { brokerUrl, username, password } = req.body;
    if (!brokerUrl || !username || !password) {
      return res.status(400).json({ message: "brokerUrl, username, and password required" });
    }
    const cred = new MqttCredential({
      brokerUrl,
      username: encrypt(username),
      password: encrypt(password)
    });
    await cred.save();
    await updateCredentialsAndReconnect();
    res.json({ message: "MQTT credentials and broker URL updated and client reconnected" });
  } catch (err) {
    next(err);
  }
};

// Revert to env credentials and reconnect (superadmin only)
exports.useDefault = async (req, res, next) => {
  try {
    await useEnvCredentials();
    res.json({ message: "MQTT credentials reset to .env defaults and client reconnected" });
  } catch (err) {
    next(err);
  }
};

// Get credential config (superadmin only, password/username hidden)
exports.get = async (req, res, next) => {
  try {
    const cred = await MqttCredential.findOne().sort({ createdAt: -1 });
    if (!cred) {
      return res.json({
        brokerUrl: process.env.MQTT_BROKER_URL,
        username: "********",
        password: "********"
      });
    }
    res.json({
      brokerUrl: cred.brokerUrl,
      username: "********",
      password: "********"
    });
  } catch (err) {
    next(err);
  }
};