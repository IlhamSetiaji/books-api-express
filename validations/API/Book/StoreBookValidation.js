const { body, validationResult } = require("express-validator");
const ResponseFormatter = require("../../../helpers/ResponseFormatter");

const storeBookValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),
  body("author")
    .notEmpty()
    .withMessage("Author is required")
    .isString()
    .withMessage("Author must be a string"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string"),
  body("publisher")
    .notEmpty()
    .withMessage("Publisher is required")
    .isString()
    .withMessage("Publisher must be a string"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.error(res, errors.array(), "Validation failed", 400);
    }
    next();
  },
];

module.exports = storeBookValidation;
