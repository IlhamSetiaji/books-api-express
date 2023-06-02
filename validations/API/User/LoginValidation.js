const { body, validationResult} = require('express-validator');
const ResponseFormatter = require('../../../helpers/ResponseFormatter');

const loginValidation = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email must be a valid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ResponseFormatter.error(res, errors.array(), 'Validation failed', 400);
        }
        next();
    }
];

module.exports = loginValidation;