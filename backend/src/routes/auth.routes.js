const express    = require('express');
const router     = express.Router();
const AuthController = require('../controllers/auth.controller');
const { validateRegister, validateLogin, validateOtp } = require('../middlewares/validation.middleware');
const { authLimiter, mfaLimiter, mfaSetupLimiter } = require('../middlewares/rateLimit.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

// ── Auth publique ──────────────────────────────
router.post('/register', authLimiter, validateRegister, AuthController.register);
router.post('/login',    authLimiter, validateLogin,    AuthController.login);

// ── MFA ───────────────────────────────────────
router.post('/mfa/verify',  mfaLimiter, validateOtp, AuthController.verifyMfa);

// ── Routes protégées (JWT requis) ──────────────
router.get ('/me',          authMiddleware, AuthController.getMe);
router.post('/mfa/setup', authMiddleware, mfaSetupLimiter, AuthController.setupMfa);
router.post('/mfa/confirm', authMiddleware, validateOtp, AuthController.confirmMfa);

router.post('/logout', authMiddleware, AuthController.logout);

module.exports = router;
