require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const logger = require('./utils/logger');


// Route imports
const pumpRoutes = require('./routes/pump');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const pumpDataRoutes = require('./routes/pumpData');
const deviceStatusRoutes = require('./routes/deviceStatus');
const mqttCredentialRoutes = require('./routes/mqttCredential');
const exchangeRateRoutes = require('./routes/exchangeRate');
const gasPriceRoutes = require('./routes/gasPrice');
const phFuelPriceRoutes = require('./routes/phFuelPrice');
const electricityPriceRoutes = require('./routes/electricityPrice');
const userFuelPriceRoutes = require('./routes/userFuelPrice');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/pumps', pumpRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pumpdata', pumpDataRoutes);
app.use('/api/devicestatus', deviceStatusRoutes);
app.use('/api/mqtt-credentials', mqttCredentialRoutes);
app.use('/api/gasprice', gasPriceRoutes);
app.use('/api/exchange-rate', exchangeRateRoutes);
app.use('/api/fuelprice', phFuelPriceRoutes);
app.use('/api/electricity-price', electricityPriceRoutes);
app.use('/api/user-fuel-price', userFuelPriceRoutes);
  


// Centralized Error Handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

// MongoDB Connection & Server Start
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
    require('./mqttClient').connectMqtt();
  })
  .catch((err) => logger.error('DB connection error:', { error: err.message }));