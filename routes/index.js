const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return res.redirect("/login");
};

/* GET home page. */
router.get("/", UserController.index);
router.get("/signup", UserController.signUp);
router.post("/signup", UserController.storeSignUp);
router.get("/login", UserController.login);
router.post("/login", UserController.storeLogin);
router.get("/profile", isLoggedIn, UserController.profile);
router.get("/logout", UserController.logout);



module.exports = router;
