module.exports = function(...allowedRoles) {
  return (req, res, next) => {
    const { user } = req;
    if (!user || !allowedRoles.includes(user.userType)) {
      return res.status(403).json({
        code: 403,
        message: 'Forbidden: insufficient role',
        details: `Required roles: ${allowedRoles.join(', ')}`
      });
    }
    next();
  };
};