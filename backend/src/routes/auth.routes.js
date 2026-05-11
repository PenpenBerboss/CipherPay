const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { validateRegister } = require('../middlewares/validation.middleware');
const { loginLimiter } = require('../middlewares/rateLimit.middleware');

router.post('/register', validateRegister, AuthController.register);
router.post('/login', loginLimiter, AuthController.login);
router.get('/me', authMiddleware, AuthController.me);

router.post('/setup-mfa', authMiddleware, AuthController.setupMFA);
router.post('/verify-mfa', authMiddleware, AuthController.verifyMFA);
router.post('/refresh', AuthController.refresh);

module.exports = router;
