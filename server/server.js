require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors'); // <--- Add CORS
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
const pumpDataAggregateRoutes = require('./routes/pumpDataAggregate');
const savingsRoutes = require('./routes/savings');
const pumpEfficiencyBaselineRoutes = require('./routes/pumpEfficiencyBaseline');
const weatherRoutes = require('./routes/weather');
const pumpMapRoutes = require('./routes/pumpMap');
const pvwattsRoutes = require('./routes/pvwatts');

const app = express();

app.use(helmet());

// --- Add CORS middleware, before any routes ---
app.use(cors({
  origin: 'http://localhost:5173', // Allow only your frontend dev origin
  credentials: true // Set to true if you use cookies or sessions (else remove)
}));

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
app.use('/api/pump-data', pumpDataAggregateRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/pump-efficiency-baseline', pumpEfficiencyBaselineRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/pump-map', pumpMapRoutes);
app.use('/api/pvwatts', pvwattsRoutes);

// Centralized Error Handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  const status = err.status || 500;
  res.status(status).json({
    code: status,
    message: err.message || 'Server error',
    details: err.details || undefined,
  });
});

// MongoDB Connection & Server Start
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
    require('./mqttClient').connectMqtt();
  })
  .catch((err) => logger.error('DB connection error:', { error: err.message }));