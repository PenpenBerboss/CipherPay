// backend/src/middlewares/auth.middleware.js
const { verifyToken } = require('../utils/jwt');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token manquant ou mal formé.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: 'Token invalide ou expiré.' });
    }

    req.user = decoded; // { userId, email }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Authentification échouée.' });
  }
};

module.exports = authMiddleware;
