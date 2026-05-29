const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const NotificationService = require('../services/notification.service');

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;
    const notifications = await NotificationService.listForUser(req.user.userId, limit);
    const unreadCount = await NotificationService.getUnreadCount(req.user.userId);

    res.status(200).json({ notifications, unreadCount });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/read', authMiddleware, async (req, res, next) => {
  try {
    const success = await NotificationService.markAsRead(req.user.userId, req.params.id);

    if (!success) {
      return res.status(404).json({ message: 'Notification introuvable.' });
    }

    const unreadCount = await NotificationService.getUnreadCount(req.user.userId);
    res.status(200).json({ message: 'Notification marquée comme lue.', unreadCount });
  } catch (err) {
    next(err);
  }
});

router.patch('/read-all', authMiddleware, async (req, res, next) => {
  try {
    const updated = await NotificationService.markAllAsRead(req.user.userId);
    const unreadCount = await NotificationService.getUnreadCount(req.user.userId);

    res.status(200).json({
      message: 'Toutes les notifications ont été marquées comme lues.',
      updated,
      unreadCount,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
