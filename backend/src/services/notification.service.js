const pool = require('../config/db');

const buildNotification = (row) => ({
  id: row.id,
  userId: row.user_id,
  type: row.type,
  title: row.title,
  message: row.message,
  isRead: Boolean(row.is_read),
  createdAt: row.created_at,
});

class NotificationService {
  static async create({ userId, type, title, message }) {
    await pool.execute(
      `INSERT INTO notifications (user_id, type, title, message, is_read)
       VALUES (?, ?, ?, ?, 0)`,
      [userId, type, title, message]
    );
  }

  static async listForUser(userId, limit = 20) {
    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const [rows] = await pool.execute(
      `SELECT id, user_id, type, title, message, is_read, created_at
       FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
      [userId, safeLimit]
    );

    return rows.map(buildNotification);
  }

  static async getUnreadCount(userId) {
    const [rows] = await pool.execute(
      `SELECT COUNT(*) AS unreadCount
       FROM notifications
       WHERE user_id = ? AND is_read = 0`,
      [userId]
    );

    return Number(rows[0]?.unreadCount || 0);
  }

  static async markAsRead(userId, notificationId) {
    const [result] = await pool.execute(
      `UPDATE notifications
       SET is_read = 1
       WHERE id = ? AND user_id = ?`,
      [notificationId, userId]
    );

    return result.affectedRows > 0;
  }

  static async markAllAsRead(userId) {
    const [result] = await pool.execute(
      `UPDATE notifications
       SET is_read = 1
       WHERE user_id = ? AND is_read = 0`,
      [userId]
    );

    return result.affectedRows;
  }
}

module.exports = NotificationService;
