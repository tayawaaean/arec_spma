const { createLogger, transports, format } = require('winston');
const path = require('path');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: path.join('logs', 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join('logs', 'app.log') }),
    new transports.Console({ format: format.simple() })
  ],
  exceptionHandlers: [
    new transports.File({ filename: path.join('logs', 'exceptions.log') })
  ]
});

module.exports = logger;