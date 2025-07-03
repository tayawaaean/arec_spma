const mqtt = require('mqtt');
const mqttLogger = require('./utils/mqttLogger');
const PumpData = require('./models/PumpData');
const DeviceStatus = require('./models/DeviceStatus');
require('dotenv').config();

const client = mqtt.connect(process.env.MQTT_BROKER_URL, {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD
});

client.on('connect', () => {
  mqttLogger.info('Connected to MQTT broker');
  // Subscribe to all pump data and status topics
  client.subscribe('arec/pump/+', (err) => {
    if (!err) mqttLogger.info('Subscribed to arec/pump/+');
    else mqttLogger.error('Subscribe error', { error: err.message });
  });
  client.subscribe('arec/pump/+/status', (err) => {
    if (!err) mqttLogger.info('Subscribed to arec/pump/+/status');
    else mqttLogger.error('Subscribe error (status)', { error: err.message });
  });
});

client.on('message', async (topic, message) => {
  try {
    // Handle status messages
    const statusMatch = topic.match(/^arec\/pump\/(\d+)\/status$/);
    if (statusMatch) {
      const pumpNumber = parseInt(statusMatch[1], 10);
      const status = message.toString(); // "online" or "offline"
      if (status === 'online' || status === 'offline') {
        await DeviceStatus.findOneAndUpdate(
          { pump: pumpNumber },
          { status, updatedAt: new Date() },
          { upsert: true, new: true }
        );
        mqttLogger.info('Pump status updated', { pump: pumpNumber, status, time: new Date().toISOString() });
      } else {
        mqttLogger.warn('Unknown status received', { pump: pumpNumber, status });
      }
      return;
    }

    // Handle telemetry data
    const dataMatch = topic.match(/^arec\/pump\/(\d+)$/);
    const pumpNumber = dataMatch ? parseInt(dataMatch[1], 10) : null;

    if (!pumpNumber) {
      mqttLogger.warn('Pump number not found in topic', { topic });
      return;
    }

    const payload = JSON.parse(message.toString());

    // Save telemetry data
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