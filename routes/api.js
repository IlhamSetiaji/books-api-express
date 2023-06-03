const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "public/uploads/" });
const BookController = require("../controllers/API/BookController");
const AuthController = require("../controllers/API/AuthController");
const storeBookValidation = require("../validations/API/Book/StoreBookValidation");
const storeUserValidation = require("../validations/API/User/StoreUserValidation");
const loginValidation = require("../validations/API/User/LoginValidation");
const userEmailValidation = require("../validations/API/User/UserEmailValidation");
const passwordResetValidation = require("../validations/API/User/PasswordResetValidation");
const passport = require("passport");
require("../config/passport-api")(passport);
const isVerified = (req, res, next) => {
    if (req.user.emailVerifiedAt != null) return next();
    return res.status(401).json({
        message: "Your account has not been verified.",
    });
};

router.post("/login", upload.any(), loginValidation, AuthController.login);
router.post(
    "/signup",
    upload.any(),
    storeUserValidation,
    AuthController.signUp
);

// Email verification routes
router.get("/auth/verify/:token", AuthController.verifyEmail);
router.post(
    "/auth/resend",
    upload.any(),
    userEmailValidation,
    AuthController.resendEmailVerification
);

// Password reset routes
router.post(
    "/auth/reset",
    upload.any(),
    userEmailValidation,
    AuthController.resetPassword
);
router.post(
    "/auth/resend-reset",
    upload.any(),
    userEmailValidation,
    AuthController.resendPasswordReset
);
router.post(
    "/auth/reset-password/:token",
    upload.any(),
    passwordResetValidation,
    AuthController.changePassword
);

//secure route
router.get(
    "/profile",
    passport.authenticate("jwt", { session: false }),
    isVerified,
    AuthController.profile
);

// Book routes
router.get("/books", BookController.getAllbooks);
router.get("/books/:id", BookController.getBookById);
router.post(
    "/books",
    passport.authenticate("jwt", { session: false }),
    isVerified,
    upload.any(),
    storeBookValidation,
    BookController.storeBook
);
router.post(
    "/books/:id",
    passport.authenticate("jwt", { session: false }),
    isVerified,
    upload.any(),
    storeBookValidation,
    BookController.updateBook
);
router.delete(
    "/books/:id",
    passport.authenticate("jwt", { session: false }),
    isVerified,
    BookController.deleteBook
);

module.exports = router;
