// backend/src/middlewares/error.middleware.js
const logger = require('../utils/logger');

const errorMiddleware = (err, req, res, next) => {
  // Erreurs métier (lancées avec { status, message })
  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }

  // Erreurs MySQL
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
  }

  // Erreur inattendue
  logger.error('Erreur serveur non gérée', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  return res.status(500).json({ message: 'Erreur serveur interne.' });
};

module.exports = errorMiddleware;
