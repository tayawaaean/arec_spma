const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ 
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        userType: user.userType
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { username, password, userType } = req.body;
    if (!['user', 'admin', 'superadmin'].includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ username, password, userType });
    res.status(201).json({
      id: user._id,
      username: user.username,
      userType: user.userType
    });
  } catch (err) {
    next(err);
  }
};

exports.protected = (req, res) => {
  res.json({ 
    message: `Hello ${req.user.username}, you are authenticated!`,
    userType: req.user.userType
  });
};