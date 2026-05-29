const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { validateRegister, validateLogin, validateOtp } = require('../middlewares/validation.middleware');
const { authLimiter, mfaLimiter, mfaSetupLimiter } = require('../middlewares/rateLimit.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const { requireAdmin } = require('../middlewares/role.middleware');

// ── Auth publique ──────────────────────────────
router.post('/register', authLimiter, validateRegister, AuthController.register);
router.post('/login', authLimiter, validateLogin, AuthController.login);

// ── MFA ───────────────────────────────────────
router.post('/mfa/verify', mfaLimiter, validateOtp, AuthController.verifyMfa);

// ── Profil utilisateur ─────────────────────────
router.get('/me', authMiddleware, AuthController.getMe);
router.put('/me', authMiddleware, AuthController.updateMe);
router.post('/mfa/setup', authMiddleware, mfaSetupLimiter, AuthController.setupMfa);
router.post('/mfa/confirm', authMiddleware, validateOtp, AuthController.confirmMfa);
router.post('/logout', authMiddleware, AuthController.logout);

// ── Administration ─────────────────────────────
router.get('/admin/users', authMiddleware, requireAdmin, AuthController.listUsers);
router.get('/admin/users/:id', authMiddleware, requireAdmin, AuthController.getUser);
router.put('/admin/users/:id', authMiddleware, requireAdmin, AuthController.updateUser);
router.delete('/admin/users/:id', authMiddleware, requireAdmin, AuthController.deleteUser);

module.exports = router;
