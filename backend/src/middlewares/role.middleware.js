// backend/src/middlewares/role.middleware.js
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const role = req.user?.role || 'user';

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Accès refusé.' });
    }

    next();
  };
};

const requireAdmin = requireRole('admin');

module.exports = {
  requireRole,
  requireAdmin,
};
