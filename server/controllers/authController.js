const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const logger = require('../utils/logger');

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      logger.warn('Failed login attempt', {
        action: 'login',
        attemptedUsername: username,
        ip: req.ip
      });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    logger.info('User logged in', {
      action: 'login',
      userId: user._id,
      username: user.username,
      userType: user.userType,
      ip: req.ip
    });

    res.json({ 
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        userType: user.userType
      }
    });
  } catch (err) {
    logger.error('Error during login', {
      action: 'login',
      error: err.message,
      attemptedUsername: req.body?.username,
      ip: req.ip
    });
    next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { username, password, userType } = req.body;
    if (!['user', 'admin', 'superadmin'].includes(userType)) {
      logger.warn('Failed registration: invalid userType', {
        action: 'register',
        attemptedUsername: username,
        attemptedUserType: userType,
        ip: req.ip
      });
      return res.status(400).json({ message: 'Invalid user type' });
    }
    const userExists = await User.findOne({ username });
    if (userExists) {
      logger.warn('Failed registration: user already exists', {
        action: 'register',
        attemptedUsername: username,
        ip: req.ip
      });
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ username, password, userType });

    logger.info('User registered', {
      action: 'register',
      userId: user._id,
      username: user.username,
      userType: user.userType,
      ip: req.ip
    });

    res.status(201).json({
      id: user._id,
      username: user.username,
      userType: user.userType
    });
  } catch (err) {
    logger.error('Error during registration', {
      action: 'register',
      error: err.message,
      attemptedUsername: req.body?.username,
      ip: req.ip
    });
    next(err);
  }
};

exports.protected = (req, res) => {
  logger.info('Protected route accessed', {
    action: 'protected',
    userId: req.user._id,
    username: req.user.username,
    userType: req.user.userType,
    ip: req.ip
  });
  res.json({ 
    message: `Hello ${req.user.username}, you are authenticated!`,
    userType: req.user.userType
  });
};