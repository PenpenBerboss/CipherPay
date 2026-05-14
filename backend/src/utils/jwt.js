const jwt = require('jsonwebtoken');

const JWT_SECRET  = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '1h';

// Générer un token
const generateToken = (payload) => {
  if (!JWT_SECRET) throw new Error('JWT_SECRET non défini dans .env');
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
};

// Vérifier un token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
