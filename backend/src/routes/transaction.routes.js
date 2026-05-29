const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware');
const TransactionService = require('../services/transaction.service');

const validateTransaction = [
  body('amount')
    .isFloat({ min: 0.01, max: 999999999999999 })
    .withMessage('Montant invalide.'),

  body('receiverEmail')
    .trim()
    .isEmail()
    .withMessage('Email destinataire invalide')
    .normalizeEmail(),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description max 200 caractères'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: 'Données invalides.',
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }
    next();
  },
];

const validateDeposit = [
  body('amount')
    .isFloat({ min: 0.01, max: 999999999999999 })
    .withMessage('Montant invalide.'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description max 200 caractères'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: 'Données invalides.',
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }
    next();
  },
];

// Route de transfert
router.post('/transfer', authMiddleware, validateTransaction, async (req, res, next) => {
  try {
    const { amount, receiverEmail, description } = req.body;
    const result = await TransactionService.createTransfer({
      senderId: req.user.userId,
      receiverEmail,
      amount,
      description,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/deposit', authMiddleware, validateDeposit, async (req, res, next) => {
  try {
    const { amount, description } = req.body;
    const result = await TransactionService.createDeposit({
      userId: req.user.userId,
      amount,
      description,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const transactions = await TransactionService.listForUser(req.user.userId);
    res.status(200).json({ transactions });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const transaction = await TransactionService.findByIdForUser(req.user.userId, req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction introuvable.' });
    }
    res.status(200).json({ transaction });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
