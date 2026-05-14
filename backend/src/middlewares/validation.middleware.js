const { body, validationResult } = require('express-validator');

// Middleware qui vérifie les erreurs de validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Données invalides.',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// Règles — Inscription
const validateRegister = [
  body('email')
    .trim()
    .isEmail().withMessage('Email invalide.')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 8 }).withMessage('Minimum 8 caractères.')
    .matches(/[A-Z]/).withMessage('Au moins une majuscule.')
    .matches(/[a-z]/).withMessage('Au moins une minuscule.')
    .matches(/[0-9]/).withMessage('Au moins un chiffre.')
    .matches(/[^A-Za-z0-9]/).withMessage('Au moins un caractère spécial.'),

  body('firstName')
    .trim()
    .notEmpty().withMessage('Prénom requis.')
    .isLength({ max: 50 }).withMessage('Prénom trop long.')
    .escape(),

  body('lastName')
    .trim()
    .notEmpty().withMessage('Nom requis.')
    .isLength({ max: 50 }).withMessage('Nom trop long.')
    .escape(),

  handleValidationErrors,
];

// Règles — Connexion
const validateLogin = [
  body('email')
    .trim()
    .isEmail().withMessage('Email invalide.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Mot de passe requis.'),

  handleValidationErrors,
];

// Règles — Code OTP
const validateOtp = [
  body('otpCode')
    .trim()
    .isLength({ min: 6, max: 6 }).withMessage('Code OTP à 6 chiffres requis.')
    .isNumeric().withMessage('Code OTP numérique uniquement.'),

  handleValidationErrors,
];

module.exports = { validateRegister, validateLogin, validateOtp };
