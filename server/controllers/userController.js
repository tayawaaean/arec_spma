const User = require('../models/User');
const logger = require('../utils/logger');

// Create user (superadmin only)
exports.createUser = async (req, res, next) => {
  try {
    const { username, password, userType } = req.body;
    if (!username || !password || !userType) {
      logger.warn('Failed to create user: missing required fields', {
        action: 'create',
        by: req.user.username,
        userType: req.user.userType,
        attemptedUsername: username,
      });
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!['user', 'admin', 'superadmin'].includes(userType)) {
      logger.warn('Failed to create user: invalid userType', {
        action: 'create',
        by: req.user.username,
        userType: req.user.userType,
        attemptedUsername: username,
        attemptedUserType: userType,
      });
      return res.status(400).json({ message: 'Invalid userType' });
    }
    const existing = await User.findOne({ username });
    if (existing) {
      logger.warn('Failed to create user: username already exists', {
        action: 'create',
        by: req.user.username,
        userType: req.user.userType,
        attemptedUsername: username,
      });
      return res.status(409).json({ message: 'Username already exists' });
    }
    const user = await User.create({ username, password, userType });

    logger.info('User created', {
      action: 'create',
      userId: user._id,
      username: user.username,
      userType: user.userType,
      by: req.user.username,
      creatorType: req.user.userType
    });

    res.status(201).json({
      id: user._id,
      username: user.username,
      userType: user.userType
    });
  } catch (err) {
    logger.error('Error creating user', {
      action: 'create',
      error: err.message,
      by: req.user?.username,
      userType: req.user?.userType
    });
    next(err);
  }
};

// Edit user (superadmin only)
exports.editUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.userType && !['user', 'admin', 'superadmin'].includes(updates.userType)) {
      logger.warn('Failed to edit user: invalid userType', {
        action: 'edit',
        by: req.user.username,
        userType: req.user.userType,
        targetUserId: id,
        attemptedUserType: updates.userType,
      });
      return res.status(400).json({ message: 'Invalid userType' });
    }
    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) {
      logger.warn('User not found for edit', {
        action: 'edit',
        by: req.user.username,
        userType: req.user.userType,
        targetUserId: id,
      });
      return res.status(404).json({ message: 'User not found' });
    }

    logger.info('User edited', {
      action: 'edit',
      userId: user._id,
      username: user.username,
      userType: user.userType,
      by: req.user.username,
      editorType: req.user.userType
    });

    res.json({
      id: user._id,
      username: user.username,
      userType: user.userType
    });
  } catch (err) {
    logger.error('Error editing user', {
      action: 'edit',
      error: err.message,
      by: req.user?.username,
      userType: req.user?.userType
    });
    next(err);
  }
};

// Delete user (superadmin only)
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      logger.warn('User not found for delete', {
        action: 'delete',
        by: req.user.username,
        userType: req.user.userType,
        targetUserId: id
      });
      return res.status(404).json({ message: 'User not found' });
    }

    logger.info('User deleted', {
      action: 'delete',
      userId: user._id,
      username: user.username,
      userType: user.userType,
      by: req.user.username,
      deleterType: req.user.userType
    });

    res.json({ message: 'User deleted' });
  } catch (err) {
    logger.error('Error deleting user', {
      action: 'delete',
      error: err.message,
      by: req.user?.username,
      userType: req.user?.userType
    });
    next(err);
  }
};

// (Optional) List all users
exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    logger.info('User list viewed', {
      action: 'list',
      by: req.user.username,
      userType: req.user.userType
    });
    res.json(users);
  } catch (err) {
    logger.error('Error listing users', {
      action: 'list',
      error: err.message,
      by: req.user?.username,
      userType: req.user?.userType
    });
    next(err);
  }
};

// Change password (any authenticated user)
exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      logger.warn('Failed password change: old or new password missing', {
        action: 'changePassword',
        by: req.user.username,
        userType: req.user.userType
      });
      return res.status(400).json({ message: 'Old and new passwords are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      logger.warn('User not found for password change', {
        action: 'changePassword',
        by: req.user.username,
        userType: req.user.userType
      });
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      logger.warn('Failed password change: previous password incorrect', {
        action: 'changePassword',
        by: req.user.username,
        userType: req.user.userType
      });
      return res.status(401).json({ message: 'Previous password is incorrect' });
    }

    user.password = newPassword; // Will be hashed by pre-save hook
    await user.save();

    logger.info('Password changed successfully', {
      action: 'changePassword',
      userId: user._id,
      username: user.username,
      userType: user.userType
    });

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    logger.error('Error changing password', {
      action: 'changePassword',
      error: err.message,
      by: req.user?.username,
      userType: req.user?.userType
    });
    next(err);
  }
};