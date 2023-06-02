const UserService = require("../services/User/UserService");
const passport = require("passport");
require("../config/passport")(passport);

const UserController = class {
    constructor() {
        this.userService = new UserService();
        this.passport = passport;
    }

    index = async (req, res) => {
        res.render("index");
    };

    login = async (req, res) => {
        res.render("login", { message: req.flash("loginMessage") });
    };

    signUp = async (req, res) => {
        res.render("signup", { message: req.flash("signupMessage") });
    };

    profile = async (req, res) => {
        res.render("profile", {
            user: req.user,
        });
    };

    storeLogin = async (req, res, next) => {
        try {
            await this.passport.authenticate("local-login", {
                successRedirect: "/profile",
                failureRedirect: "/login",
                failureFlash: true,
            })(req, res, next);
        } catch (error) {
            return res.send(error);
        }
    };

    storeSignUp = async (req, res, next) => {
        try {
            await this.passport.authenticate("local-signup", {
                successRedirect: "/profile",
                failureRedirect: "/signup",
                failureFlash: true,
            })(req, res, next);
        } catch (error) {
            return res.send(error);
        }
    };

    logout = (req, res) => {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            res.redirect("/");
        });
    };
};

module.exports = new UserController();
