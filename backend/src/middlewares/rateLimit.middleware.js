const rateLimit = require('express-rate-limit');

// Limiteur général sur toutes les routes API
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de requêtes, réessayez dans 15 minutes.' },
});

// Limiteur strict sur les routes d'authentification
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' },
  skipSuccessfulRequests: true, // Ne compte pas les succès
});

// Limiteur sur la vérification MFA
const mfaLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de tentatives MFA. Réessayez dans 5 minutes.' },
});

// Limiteur setup MFA (moins strict)
const mfaSetupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 tentatives de setup par 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de requêtes, réessayez dans 15 minutes.' },
});

module.exports = { globalLimiter, authLimiter, mfaLimiter, mfaSetupLimiter };
