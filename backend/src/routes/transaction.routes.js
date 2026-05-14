// backend/src/routes/transaction.routes.js
const express    = require('express');
const router     = express.Router();
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware');

const validateTransaction = [
  body('amount')
    .isFloat({ min: 0.01, max: 9999.99 })
    .withMessage('Montant invalide (entre 0.01 et 9999.99)'),

  body('receiverEmail')
    .trim()
    .isEmail()
    .withMessage('Email destinataire invalide')
    .normalizeEmail(),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description max 200 caractères')
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: 'Données invalides.',
        errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
      });
    }
    next();
  },
];

// Route de transfert
router.post('/transfer', authMiddleware, validateTransaction, async (req, res) => {
  try {
    const { amount, receiverEmail, description } = req.body;
    // Logique de transfert à connecter avec le service existant
    res.status(200).json({
      message: 'Transaction validée.',
      data: { amount, receiverEmail, description }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;
