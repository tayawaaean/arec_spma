const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      code: 401,
      message: 'No token, authorization denied',
      details: 'Missing or malformed Authorization header'
    });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user)
      return res.status(401).json({
        code: 401,
        message: 'User not found',
        details: 'User associated with token does not exist'
      });
    next();
  } catch (err) {
    return res.status(401).json({
      code: 401,
      message: 'Token is not valid',
      details: err.message
    });
  }
};