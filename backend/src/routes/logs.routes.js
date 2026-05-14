const express      = require('express');
const router       = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const ActivityLog  = require('../models/ActivityLog');

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const logs = await ActivityLog.getForUser(req.user.userId, 50);
    res.status(200).json({ logs });
  } catch (err) { next(err); }
});

module.exports = router;
