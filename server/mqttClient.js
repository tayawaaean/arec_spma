const mqtt = require('mqtt');
const mqttLogger = require('./utils/mqttLogger');
const PumpData = require('./models/PumpData');
require('dotenv').config();

const client = mqtt.connect(process.env.MQTT_BROKER_URL, {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD
});

client.on('connect', () => {
  mqttLogger.info('Connected to MQTT broker');
  // Subscribe to all pumps (arec/pump1, arec/pump2, ...)
  client.subscribe('arec/pump+', (err) => {
    if (!err) mqttLogger.info('Subscribed to arec/pump+');
    else mqttLogger.error('Subscribe error', { error: err.message });
  });
});

client.on('message', async (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());
    // Extract pump number from topic, e.g., "arec/pump2" -> 2
    const match = topic.match(/pump(\d+)/);
    const pumpNumber = match ? parseInt(match[1]) : null;

    if (!pumpNumber) {
      mqttLogger.warn('Pump number not found in topic', { topic });
      return;
    }

    // Save to DB
    const data = new PumpData({
      pump: pumpNumber,
      time: new Date(payload.time),
      filtered_current: payload.filtered_current,
      filtered_voltage: payload.filtered_voltage,
      flow: payload.flow,
      power: payload.power,
      accumulated_energy_wh: payload.accumulated_energy_wh,
      total_water_volume: payload.total_water_volume
    });
    await data.save();

    mqttLogger.info('Pump data saved', { pump: pumpNumber, time: payload.time });
  } catch (err) {
    mqttLogger.error('Failed to process MQTT message', { error: err.message, topic, message: message.toString() });
  }
});

module.exports = client;