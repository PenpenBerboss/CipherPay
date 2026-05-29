// backend/src/services/auth.service.js
const User = require('../models/User');
const LoginAttempt = require('../models/LoginAttempt');
const ActivityLog = require('../models/ActivityLog');
const pool = require('../config/db');
const { generateToken } = require('../utils/jwt');
const totpUtils = require('../utils/totp');
const logger = require('../utils/logger');

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

class AuthService {
  static buildTokenPayload(user) {
    return {
      userId: user.id,
      email: user.email,
      role: user.role || 'user',
    };
  }

  static buildUserResponse(user) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      balance: Number(user.balance || 0),
      totpEnabled: !!user.totp_enabled,
      role: user.role || 'user',
    };
  }

  static async register({ email, password, firstName, lastName, ip, userAgent }) {
    const existing = await User.findByEmail(email);
    if (existing) {
      throw { status: 409, message: 'Cet email est déjà utilisé.' };
    }

    const user = await User.create({ email, password, firstName, lastName, role: 'user' });

    await ActivityLog.log({
      userId: user.id,
      action: 'REGISTER',
      ipAddress: ip,
      userAgent,
      details: { email },
    });

    logger.info('Nouvel utilisateur inscrit', { userId: user.id, email });

    return { message: 'Compte créé avec succès.', userId: user.id, role: 'user' };
  }

  static async login({ email, password, ip, userAgent }) {
    const user = await User.findByEmail(email);

    if (user && user.is_locked) {
      const now = new Date();
      if (user.locked_until && new Date(user.locked_until) > now) {
        const remaining = Math.ceil((new Date(user.locked_until) - now) / 60000);
        throw {
          status: 423,
          message: `Compte verrouillé. Réessayez dans ${remaining} minute(s).`,
        };
      }
      await User.unlockAccount(email);
    }

    const failCount = await LoginAttempt.countRecentFailures(email, ip);
    if (failCount >= MAX_ATTEMPTS) {
      if (user) await User.lockAccount(email, LOCK_MINUTES);
      throw {
        status: 429,
        message: `Trop de tentatives. Compte bloqué ${LOCK_MINUTES} minutes.`,
      };
    }

    const validPassword = user && await User.verifyPassword(password, user.password_hash);

    if (!user || !validPassword) {
      await LoginAttempt.record({ email, ipAddress: ip, success: false });
      await ActivityLog.log({ userId: user?.id, action: 'LOGIN_FAILED', ipAddress: ip, userAgent });
      logger.warn('Tentative de connexion échouée', { email, ip });
      throw { status: 401, message: 'Email ou mot de passe incorrect.' };
    }

    await LoginAttempt.record({ email, ipAddress: ip, success: true });
    await LoginAttempt.clearForEmail(email);

    await ActivityLog.log({
      userId: user.id,
      action: 'LOGIN_SUCCESS',
      ipAddress: ip,
      userAgent,
    });

    if (user.totp_enabled) {
      return { requiresMfa: true, userId: user.id, role: user.role || 'user' };
    }

    const token = generateToken(this.buildTokenPayload(user));

    logger.info('Connexion réussie', { userId: user.id });

    return {
      requiresMfa: false,
      token,
      user: this.buildUserResponse(user),
    };
  }

  static async verifyMfa({ userId, otpCode, ip, userAgent }) {
    const user = await User.findById(userId);
    if (!user) throw { status: 404, message: 'Utilisateur introuvable.' };

    const [secretRows] = await pool.execute(
      'SELECT totp_secret FROM users WHERE id = ?',
      [userId]
    );

    const secret = secretRows[0]?.totp_secret;
    if (!secret) throw { status: 400, message: 'MFA non configuré.' };

    const valid = totpUtils.verifyToken(secret, otpCode);
    if (!valid) {
      await ActivityLog.log({ userId, action: 'MFA_FAILED', ipAddress: ip, userAgent });
      throw { status: 401, message: 'Code OTP invalide.' };
    }

    await ActivityLog.log({ userId, action: 'MFA_SUCCESS', ipAddress: ip, userAgent });

    const token = generateToken(this.buildTokenPayload(user));

    return {
      token,
      user: this.buildUserResponse(user),
    };
  }

  static async setupMfa(userId) {
    const user = await User.findById(userId);
    if (!user) throw { status: 404, message: 'Utilisateur introuvable.' };

    const secret = totpUtils.generateSecret(user.email);
    await User.updateTotpSecret(userId, secret.base32);

    const qrCode = await totpUtils.generateQRCode(secret.otpauth_url);

    return { secret: secret.base32, qrCode };
  }

  static async confirmMfa({ userId, otpCode }) {
    const [rows] = await pool.execute(
      'SELECT totp_secret FROM users WHERE id = ?',
      [userId]
    );
    const secret = rows[0]?.totp_secret;
    if (!secret) throw { status: 400, message: "Lance setupMfa d'abord." };

    const valid = totpUtils.verifyToken(secret, otpCode);
    if (!valid) throw { status: 401, message: 'Code OTP invalide.' };

    await User.enableTotp(userId);
    await ActivityLog.log({ userId, action: 'MFA_ENABLED' });

    return { message: 'MFA activé avec succès.' };
  }

  static async updateProfile(userId, { email, firstName, lastName }) {
    const updatedUser = await User.updateProfile(userId, {
      email: email?.trim(),
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
    });

    if (!updatedUser) {
      throw { status: 404, message: 'Utilisateur introuvable.' };
    }

    await ActivityLog.log({
      userId,
      action: 'PROFILE_UPDATED',
      details: {
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
      },
    });

    return {
      message: 'Profil mis à jour avec succès.',
      user: this.buildUserResponse(updatedUser),
    };
  }

  static async listUsers({ search = '', limit = 50, offset = 0 } = {}) {
    const [users, total] = await Promise.all([
      User.list({ search, limit, offset }),
      User.count({ search }),
    ]);

    return {
      users: users.map((user) => this.buildUserResponse(user)),
      total,
      limit: Math.min(Math.max(Number(limit) || 50, 1), 200),
      offset: Math.max(Number(offset) || 0, 0),
    };
  }

  static async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) throw { status: 404, message: 'Utilisateur introuvable.' };
    return this.buildUserResponse(user);
  }

  static async updateUser(userId, payload) {
    const updated = await User.update(userId, {
      email: payload.email?.trim(),
      firstName: payload.firstName?.trim(),
      lastName: payload.lastName?.trim(),
      balance: payload.balance,
      role: payload.role,
      totpEnabled: payload.totpEnabled,
      isLocked: payload.isLocked,
    });

    if (!updated) {
      throw { status: 404, message: 'Utilisateur introuvable.' };
    }

    await ActivityLog.log({
      userId,
      action: 'ADMIN_USER_UPDATED',
      details: {
        role: updated.role,
        balance: updated.balance,
      },
    });

    return this.buildUserResponse(updated);
  }

  static async deleteUser(userId) {
    const existing = await User.findById(userId);
    if (!existing) throw { status: 404, message: 'Utilisateur introuvable.' };

    await User.deleteById(userId);

    return { message: 'Utilisateur supprimé avec succès.' };
  }
}

module.exports = AuthService;
