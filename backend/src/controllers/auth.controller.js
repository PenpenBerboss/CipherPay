const AuthService = require('../services/auth.service');
const bcrypt = require('bcryptjs');
const jwtUtil = require('../utils/jwt');
const totp = require('../utils/totp');

exports.register = async (req, res, next) => {
    try {
        const user = await AuthService.register(req.body);
        res.status(201).json({ message: 'Utilisateur créé' });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await AuthService.findByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        if (user.lock_until && user.lock_until > new Date()) {
           return res.status(401).json({ message: 'Compte verrouillé, réessayez plus tard.' });
        }
        
        await user.update({ failed_attempts: 0, last_login: new Date() });
        const token = jwtUtil.generateToken(user);
        res.status(200).json({ token, user: { uuid: user.uuid, email: user.email } });
    } catch (error) {
        next(error);
    }
};

// ... (previous imports and methods)
exports.setupMFA = async (req, res, next) => {
    try {
        const secret = totp.generateSecret();
        await req.user.update({ mfa_secret: secret.base32 });
        const qrCode = await totp.generateQRCode(secret.otpauth_url);
        res.json({ secret: secret.base32, qrCode });
    } catch (error) { next(error); }
};

exports.verifyMFA = async (req, res, next) => {
    try {
        const { token } = req.body;
        const valid = totp.verifyToken(req.user.mfa_secret, token);
        if (!valid) return res.status(401).json({ message: 'Code invalide' });
        await req.user.update({ is_mfa_enabled: true });
        res.json({ message: 'MFA activé' });
    } catch (error) { next(error); }
};

exports.refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(401).json({ message: 'Token de rafraichissement manquant' });

        const decoded = jwtUtil.verifyToken(refreshToken);
        const user = await User.findByPk(decoded.id);

        if (!user) return res.status(401).json({ message: 'Utilisateur introuvable' });

        const newAccessToken = jwtUtil.generateToken(user);
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(401).json({ message: 'Token de rafraichissement invalide' });
    }
};
