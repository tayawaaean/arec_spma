require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const logger = require('./utils/logger');

// Route imports
const pumpRoutes = require('./routes/pump');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const pumpDataRoutes = require('./routes/pumpData');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/pumps', pumpRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pumpdata', pumpDataRoutes);

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
    require('./mqttClient'); // Connect MQTT only after DB is ready
  })
  .catch((err) => logger.error('DB connection error:', { error: err.message }));