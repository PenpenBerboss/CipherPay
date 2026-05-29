const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const ActivityLog = require('../models/ActivityLog');

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    const logs = isAdmin
      ? await ActivityLog.getAll({ limit: 100, offset: Number(req.query.offset) || 0 })
      : await ActivityLog.getForUser(req.user.userId, Number(req.query.limit) || 50);

    res.status(200).json({ logs });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
