const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

class User {
  // Créer un utilisateur
  static async create({ email, password, firstName, lastName }) {
    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      `INSERT INTO users (id, email, password_hash, first_name, last_name)
       VALUES (?, ?, ?, ?, ?)`,
      [id, email, passwordHash, firstName, lastName]
    );

    return { id, email, firstName, lastName };
  }

  // Trouver par email
  static async findByEmail(email) {
    const [rows] = await pool.execute(
      `SELECT * FROM users WHERE email = ? LIMIT 1`,
      [email]
    );
    return rows[0] || null;
  }

  // Trouver par ID
  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT id, email, first_name, last_name, balance,
              totp_enabled, is_locked, locked_until, created_at
       FROM users WHERE id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  }

  // Vérifier le mot de passe
  static async verifyPassword(plainPassword, passwordHash) {
    return bcrypt.compare(plainPassword, passwordHash);
  }

  // Mettre à jour le secret TOTP
  static async updateTotpSecret(userId, secret) {
    await pool.execute(
      `UPDATE users SET totp_secret = ?, totp_enabled = 0 WHERE id = ?`,
      [secret, userId]
    );
  }

  // Activer le TOTP
  static async enableTotp(userId) {
    await pool.execute(
      `UPDATE users SET totp_enabled = 1 WHERE id = ?`,
      [userId]
    );
  }

  // Verrouiller le compte
  static async lockAccount(email, minutes = 15) {
    const lockedUntil = new Date(Date.now() + minutes * 60 * 1000);
    await pool.execute(
      `UPDATE users SET is_locked = 1, locked_until = ? WHERE email = ?`,
      [lockedUntil, email]
    );
  }

  // Déverrouiller le compte
  static async unlockAccount(email) {
    await pool.execute(
      `UPDATE users SET is_locked = 0, locked_until = NULL WHERE email = ?`,
      [email]
    );
  }
}

module.exports = User;
