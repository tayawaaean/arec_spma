const { createLogger, transports, format } = require('winston');
const path = require('path');

const mqttLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: path.join('logs', 'mqtt.log') }),
    new transports.Console({ format: format.simple() })
  ]
});

module.exports = mqttLogger;