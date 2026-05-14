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
}

module.exports = ActivityLog;
