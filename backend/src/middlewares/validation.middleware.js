const { body, validationResult } = require('express-validator');

exports.validateRegister = [
    body('email').isEmail().withMessage('Email invalide'),
    body('password').isStrongPassword({ minLength: 4, minUppercase: 1, minNumbers: 1, minSymbols: 1 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        next();
    }
];
