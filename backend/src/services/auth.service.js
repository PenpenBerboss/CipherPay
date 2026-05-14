// backend/src/services/auth.service.js
const User          = require('../models/User');
const LoginAttempt  = require('../models/LoginAttempt');
const ActivityLog   = require('../models/ActivityLog');
const { generateToken } = require('../utils/jwt');
const totpUtils     = require('../utils/totp');
const logger        = require('../utils/logger');

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

class AuthService {

  // ── INSCRIPTION ──────────────────────────────────────────
  static async register({ email, password, firstName, lastName, ip, userAgent }) {
    // Vérifier si l'email existe déjà
    const existing = await User.findByEmail(email);
    if (existing) {
      throw { status: 409, message: 'Cet email est déjà utilisé.' };
    }

    const user = await User.create({ email, password, firstName, lastName });

    await ActivityLog.log({
      userId: user.id,
      action: 'REGISTER',
      ipAddress: ip,
      userAgent,
      details: { email },
    });

    logger.info('Nouvel utilisateur inscrit', { userId: user.id, email });

    return { message: 'Compte créé avec succès.', userId: user.id };
  }

  // ── CONNEXION ─────────────────────────────────────────────
  static async login({ email, password, ip, userAgent }) {
    const user = await User.findByEmail(email);

    // Vérifier si le compte est verrouillé
    if (user && user.is_locked) {
      const now = new Date();
      if (user.locked_until && new Date(user.locked_until) > now) {
        const remaining = Math.ceil((new Date(user.locked_until) - now) / 60000);
        throw {
          status: 423,
          message: `Compte verrouillé. Réessayez dans ${remaining} minute(s).`,
        };
      } else {
        // Déverrouillage automatique si délai expiré
        await User.unlockAccount(email);
      }
    }

    // Compter les tentatives échouées récentes
    const failCount = await LoginAttempt.countRecentFailures(email, ip);
    if (failCount >= MAX_ATTEMPTS) {
      if (user) await User.lockAccount(email, LOCK_MINUTES);
      throw {
        status: 429,
        message: `Trop de tentatives. Compte bloqué ${LOCK_MINUTES} minutes.`,
      };
    }

    // Vérifier utilisateur + mot de passe
    const validPassword = user && await User.verifyPassword(password, user.password_hash);

    if (!user || !validPassword) {
      await LoginAttempt.record({ email, ipAddress: ip, success: false });
      await ActivityLog.log({ userId: user?.id, action: 'LOGIN_FAILED', ipAddress: ip, userAgent });
      logger.warn('Tentative de connexion échouée', { email, ip });
      throw { status: 401, message: 'Email ou mot de passe incorrect.' };
    }

    // Succès — nettoyer les tentatives
    await LoginAttempt.record({ email, ipAddress: ip, success: true });
    await LoginAttempt.clearForEmail(email);

    await ActivityLog.log({
      userId: user.id,
      action: 'LOGIN_SUCCESS',
      ipAddress: ip,
      userAgent,
    });

    // Si TOTP activé → demander le code OTP
    if (user.totp_enabled) {
      return { requiresMfa: true, userId: user.id };
    }

    // Sinon → générer le JWT directement
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    logger.info('Connexion réussie', { userId: user.id });

    return {
      requiresMfa: false,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        balance: user.balance,
        totpEnabled: !!user.totp_enabled,
      },
    };
  }

  // ── VÉRIFICATION MFA ──────────────────────────────────────
  static async verifyMfa({ userId, otpCode, ip, userAgent }) {
    const user = await User.findById(userId);
    if (!user) throw { status: 404, message: 'Utilisateur introuvable.' };

    // Récupérer le secret (findById ne retourne pas totp_secret)
    const [rows] = require('../config/db').execute
      ? await require('../config/db').execute(
          'SELECT totp_secret FROM users WHERE id = ?', [userId]
        )
      : [[]];

    const fullUser = rows?.[0];
    const pool = require('../config/db');
    const [secretRows] = await pool.execute(
      'SELECT totp_secret FROM users WHERE id = ?', [userId]
    );

    const secret = secretRows[0]?.totp_secret;
    if (!secret) throw { status: 400, message: 'MFA non configuré.' };

    const valid = totpUtils.verifyToken(secret, otpCode);
    if (!valid) {
      await ActivityLog.log({ userId, action: 'MFA_FAILED', ipAddress: ip, userAgent });
      throw { status: 401, message: 'Code OTP invalide.' };
    }

    await ActivityLog.log({ userId, action: 'MFA_SUCCESS', ipAddress: ip, userAgent });

    const token = generateToken({ userId: user.id, email: user.email });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        balance: user.balance,
        totpEnabled: true,
      },
    };
  }

  // ── SETUP MFA ─────────────────────────────────────────────
  static async setupMfa(userId) {
    const user = await User.findById(userId);
    if (!user) throw { status: 404, message: 'Utilisateur introuvable.' };

    const secret = totpUtils.generateSecret(user.email);
    await User.updateTotpSecret(userId, secret.base32);

    const qrCode = await totpUtils.generateQRCode(secret.otpauth_url);

    return { secret: secret.base32, qrCode };
  }

  // ── CONFIRMER MFA ─────────────────────────────────────────
  static async confirmMfa({ userId, otpCode }) {
    const pool = require('../config/db');
    const [rows] = await pool.execute(
      'SELECT totp_secret FROM users WHERE id = ?', [userId]
    );
    const secret = rows[0]?.totp_secret;
    if (!secret) throw { status: 400, message: 'Lance setupMfa d\'abord.' };

    const valid = totpUtils.verifyToken(secret, otpCode);
    if (!valid) throw { status: 401, message: 'Code OTP invalide.' };

    await User.enableTotp(userId);
    await ActivityLog.log({ userId, action: 'MFA_ENABLED' });

    return { message: 'MFA activé avec succès.' };
  }
}

module.exports = AuthService;
