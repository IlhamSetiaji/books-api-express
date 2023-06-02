const { body, validationResult } = require("express-validator");
const ResponseFormatter = require("../../../helpers/ResponseFormatter");

const userEmailValidation = [
    body("email")
        .isEmail()
        .withMessage("Email must be a valid email"),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return ResponseFormatter.error(res, errors.array(), "Validation failed", 400);
            }
            next();
        }
];

module.exports = userEmailValidation;