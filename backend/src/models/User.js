const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const mapUserRow = (row) => {
  if (!row) return null;

  return {
    id: row.id,
    email: row.email,
    password_hash: row.password_hash,
    first_name: row.first_name,
    last_name: row.last_name,
    balance: row.balance,
    role: row.role || 'user',
    totp_enabled: row.totp_enabled,
    is_locked: row.is_locked,
    locked_until: row.locked_until,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
};

class User {
  static async create({ email, password, firstName, lastName, role = 'user' }) {
    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);

    await pool.execute(
      `INSERT INTO users (id, email, password_hash, first_name, last_name, role)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, email, passwordHash, firstName, lastName, role]
    );

    return { id, email, firstName, lastName, role };
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      `SELECT id, email, password_hash, first_name, last_name, balance,
              role, totp_enabled, is_locked, locked_until, created_at, updated_at
       FROM users WHERE email = ? LIMIT 1`,
      [email]
    );
    return mapUserRow(rows[0]);
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT id, email, password_hash, first_name, last_name, balance,
              role, totp_enabled, is_locked, locked_until, created_at, updated_at
       FROM users WHERE id = ? LIMIT 1`,
      [id]
    );
    return mapUserRow(rows[0]);
  }

  static async list({ search = '', limit = 50, offset = 0 } = {}) {
    const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 200);
    const safeOffset = Math.max(Number(offset) || 0, 0);
    const query = `%${String(search).trim()}%`;

    const [rows] = await pool.execute(
      `SELECT id, email, first_name, last_name, balance,
              role, totp_enabled, is_locked, locked_until, created_at, updated_at
       FROM users
       WHERE (? = '' OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [String(search).trim(), query, query, query, safeLimit, safeOffset]
    );

    return rows.map(mapUserRow);
  }

  static async count({ search = '' } = {}) {
    const query = `%${String(search).trim()}%`;
    const [rows] = await pool.execute(
      `SELECT COUNT(*) AS total
       FROM users
       WHERE (? = '' OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)`,
      [String(search).trim(), query, query, query]
    );

    return Number(rows[0]?.total || 0);
  }

  static async update(id, fields = {}) {
    const allowedKeys = {
      email: 'email',
      firstName: 'first_name',
      lastName: 'last_name',
      balance: 'balance',
      role: 'role',
      totpEnabled: 'totp_enabled',
      isLocked: 'is_locked',
      lockedUntil: 'locked_until',
    };

    const entries = Object.entries(fields)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [allowedKeys[key], value])
      .filter(([column]) => column);

    if (entries.length === 0) {
      throw { status: 400, message: 'Aucune donnée à mettre à jour.' };
    }

    const setClause = entries.map(([column]) => `${column} = ?`).join(', ');
    const values = entries.map(([, value]) => value);

    await pool.execute(
      `UPDATE users SET ${setClause} WHERE id = ?`,
      [...values, id]
    );

    return this.findById(id);
  }

  static async updateProfile(id, { email, firstName, lastName }) {
    const fields = {};
    if (email !== undefined) fields.email = email;
    if (firstName !== undefined) fields.firstName = firstName;
    if (lastName !== undefined) fields.lastName = lastName;
    return this.update(id, fields);
  }

  static async deleteById(id) {
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    return true;
  }

  static async verifyPassword(plainPassword, passwordHash) {
    return bcrypt.compare(plainPassword, passwordHash);
  }

  static async updateTotpSecret(userId, secret) {
    await pool.execute(
      `UPDATE users SET totp_secret = ?, totp_enabled = 0 WHERE id = ?`,
      [secret, userId]
    );
  }

  static async enableTotp(userId) {
    await pool.execute(
      `UPDATE users SET totp_enabled = 1 WHERE id = ?`,
      [userId]
    );
  }

  static async lockAccount(email, minutes = 15) {
    const lockedUntil = new Date(Date.now() + minutes * 60 * 1000);
    await pool.execute(
      `UPDATE users SET is_locked = 1, locked_until = ? WHERE email = ?`,
      [lockedUntil, email]
    );
  }

  static async unlockAccount(email) {
    await pool.execute(
      `UPDATE users SET is_locked = 0, locked_until = NULL WHERE email = ?`,
      [email]
    );
  }
}

module.exports = User;
