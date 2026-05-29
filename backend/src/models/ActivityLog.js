// backend/src/models/ActivityLog.js
const pool = require('../config/db');

class ActivityLog {
  static async log({ userId = null, action, ipAddress = null, userAgent = null, details = null }) {
    await pool.execute(
      `INSERT INTO activity_logs (user_id, action, ip_address, user_agent, details)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, action, ipAddress, userAgent, details ? JSON.stringify(details) : null]
    );
  }

  static async getForUser(userId, limit = 50) {
    const [rows] = await pool.execute(
      `SELECT * FROM activity_logs
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
      [userId, limit]
    );
    return rows;
  }

  static async getAll({ limit = 100, offset = 0 } = {}) {
    const safeLimit = Math.min(Math.max(Number(limit) || 100, 1), 500);
    const safeOffset = Math.max(Number(offset) || 0, 0);

    const [rows] = await pool.execute(
      `SELECT * FROM activity_logs
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [safeLimit, safeOffset]
    );

    return rows;
  }
}

module.exports = ActivityLog;
