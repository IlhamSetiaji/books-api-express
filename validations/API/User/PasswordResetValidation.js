const { body, validationResult } = require("express-validator");
const ResponseFormatter = require("../../../helpers/ResponseFormatter");

const passwordResetValidation = [
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    body("password_confirmation")
        .notEmpty()
        .withMessage("Password confirmation is required")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Password confirmation does not match password");
            }
            return true;
        }
    ),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ResponseFormatter.error(res, errors.array(), "Validation failed", 400);
        }
        next();
    }
];

module.exports = passwordResetValidation;