// backend/src/models/LoginAttempt.js
const pool = require('../config/db');

class LoginAttempt {
  // Enregistrer une tentative
  static async record({ email, ipAddress, success }) {
    await pool.execute(
      `INSERT INTO login_attempts (email, ip_address, success)
       VALUES (?, ?, ?)`,
      [email, ipAddress, success ? 1 : 0]
    );
  }

  // Compter les échecs récents (fenêtre de 15 min)
  static async countRecentFailures(email, ipAddress, windowMinutes = 15) {
    const since = new Date(Date.now() - windowMinutes * 60 * 1000);
    const [rows] = await pool.execute(
      `SELECT COUNT(*) as count FROM login_attempts
       WHERE (email = ? OR ip_address = ?)
         AND success = 0
         AND attempted_at >= ?`,
      [email, ipAddress, since]
    );
    return rows[0].count;
  }

  // Supprimer les tentatives après succès
  static async clearForEmail(email) {
    await pool.execute(
      `DELETE FROM login_attempts WHERE email = ?`,
      [email]
    );
  }
}

module.exports = LoginAttempt;
