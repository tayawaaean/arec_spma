const Pump = require('../models/Pump');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');
const reverseGeocode = require('../utils/reverseGeocode');

// Add a new pump (admin/superadmin)
exports.addPump = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const {
      solarPumpNumber,
      model,
      power,
      acInputVoltage,
      pvOperatingVoltage,
      openCircuitVoltage,
      outlet,
      maxHead,
      maxFlow,
      solarPanelConfig,
      image,
      lat,
      lng,
      timeInstalled,
      status,
      address // optional, can be partial or missing
    } = req.body;

    let resolvedAddress = address || {};
    // Autofetch address fields if not provided or incomplete
    if (!address || !address.municipality || !address.region || !address.country) {
      const geoAddress = await reverseGeocode(lat, lng);
      resolvedAddress = { ...geoAddress, ...address };
    }

    const pump = await Pump.create({
      solarPumpNumber,
      model,
      power,
      acInputVoltage,
      pvOperatingVoltage,
      openCircuitVoltage,
      outlet,
      maxHead,
      maxFlow,
      solarPanelConfig,
      image,
      lat,
      lng,
      timeInstalled,
      status,
      address: resolvedAddress,
      createdBy: req.user.username,
      updatedBy: req.user.username
    });

    logger.info('Pump added', {
      action: 'add',
      pumpId: pump._id,
      solarPumpNumber: pump.solarPumpNumber,
      by: req.user.username,
      userType: req.user.userType
    });

    res.status(201).json(pump);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.solarPumpNumber) {
      return res.status(400).json({ message: "solarPumpNumber must be unique" });
    }
    logger.error('Error adding pump', { action: 'add', error: error.message, by: req.user?.username, userType: req.user?.userType });
    next(error);
  }
};

// Edit pump (admin/superadmin)
exports.editPump = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { lat, lng, address } = req.body;
    let updatedFields = { ...req.body, updatedBy: req.user.username };

    // If address is missing or incomplete, autofetch it
    if ((!address || !address.municipality || !address.region || !address.country) && lat && lng) {
      const geoAddress = await reverseGeocode(lat, lng);
      updatedFields.address = { ...geoAddress, ...address };
    }

    const pump = await Pump.findByIdAndUpdate(req.params.id, updatedFields, { new: true, runValidators: true });
    if (!pump) {
      logger.warn('Pump not found for edit', {
        action: 'edit',
        pumpId: req.params.id,
        by: req.user.username,
        userType: req.user.userType
      });
      return res.status(404).json({ message: 'Pump not found' });
    }
    logger.info('Pump edited', {
      action: 'edit',
      pumpId: pump._id,
      solarPumpNumber: pump.solarPumpNumber,
      by: req.user.username,
      userType: req.user.userType
    });
    res.json(pump);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.solarPumpNumber) {
      return res.status(400).json({ message: "solarPumpNumber must be unique" });
    }
    logger.error('Error editing pump', { action: 'edit', error: error.message, by: req.user?.username, userType: req.user?.userType });
    next(error);
  }
};

// Delete pump (admin/superadmin)
exports.deletePump = async (req, res, next) => {
  try {
    const pump = await Pump.findByIdAndDelete(req.params.id);
    if (!pump) {
      logger.warn('Pump not found for delete', {
        action: 'delete',
        pumpId: req.params.id,
        by: req.user.username,
        userType: req.user.userType
      });
      return res.status(404).json({ message: 'Pump not found' });
    }
    logger.info('Pump deleted', {
      action: 'delete',
      pumpId: pump._id,
      solarPumpNumber: pump.solarPumpNumber,
      by: req.user.username,
      userType: req.user.userType
    });
    res.json({ message: 'Pump deleted' });
  } catch (error) {
    logger.error('Error deleting pump', {
      action: 'delete',
      error: error.message,
      by: req.user?.username,
      userType: req.user?.userType
    });
    next(error);
  }
};

// List all pumps (any authenticated user) WITH PAGINATION AND FILTERING
exports.listPumps = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, ...filters } = req.query;
    const q = {};
    // Example filters: solarPumpNumber, model, status
    if (filters.solarPumpNumber) q.solarPumpNumber = new RegExp(filters.solarPumpNumber, 'i');
    if (filters.model) q.model = new RegExp(filters.model, 'i');
    if (filters.status) q.status = filters.status;

    const pumps = await Pump.find(q)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Pump.countDocuments(q);

    logger.info('Pump list viewed', {
      action: 'list',
      by: req.user.username,
      userType: req.user.userType,
      filter: filters,
      page: Number(page),
      limit: Number(limit)
    });

    res.json({
      data: pumps,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    logger.error('Error listing pumps', {
      action: 'list',
      error: error.message,
      by: req.user?.username,
      userType: req.user?.userType
    });
    next(error);
  }
};

// Get a single pump (any authenticated user)
exports.getPump = async (req, res, next) => {
  try {
    const pump = await Pump.findById(req.params.id);
    if (!pump) {
      logger.warn('Pump not found for get', {
        action: 'get',
        pumpId: req.params.id,
        by: req.user.username,
        userType: req.user.userType
      });
      return res.status(404).json({ message: 'Pump not found' });
    }
    logger.info('Pump viewed', {
      action: 'get',
      pumpId: pump._id,
      solarPumpNumber: pump.solarPumpNumber,
      by: req.user.username,
      userType: req.user.userType
    });
    res.json(pump);
  } catch (error) {
    logger.error('Error getting pump', {
      action: 'get',
      error: error.message,
      by: req.user?.username,
      userType: req.user?.userType
    });
    next(error);
  }
};