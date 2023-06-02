const ResponseFormatter = require("../../helpers/ResponseFormatter");
const UserService = require("../../services/User/UserService");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("../../config/passport-api")(passport);

const AuthController = class {
    constructor() {
        this.passport = passport;
        this.userService = new UserService();
    }

    exclude = async (obj, keys) => {
        const newObj = {};
        Object.keys(obj).forEach((key) => {
            if (!keys.includes(key)) {
                newObj[key] = obj[key];
            }
        });
        return newObj;
    };

    login = async (req, res, next) => {
        try {
            await this.passport.authenticate(
                "local-login",
                async (err, user, info) => {
                    try {
                        if (err || !user) {
                            return ResponseFormatter.error(
                                res,
                                err,
                                err ? err.message : info.message,
                                400
                            );
                        }
                        req.login(user, { session: false }, async (error) => {
                            if (error) {
                                return ResponseFormatter.error(
                                    res,
                                    error,
                                    "Login failed",
                                    400
                                );
                            }
                            const token = jwt.sign(user, "authToken", {
                                expiresIn: "1d",
                            });
                            return ResponseFormatter.success(
                                res,
                                {
                                    tokenType: "bearer token",
                                    token,
                                    user: await this.exclude(user, [
                                        "password",
                                    ]),
                                },
                                "Login success"
                            );
                        });
                    } catch (error) {
                        return ResponseFormatter.error(
                            res,
                            error,
                            "Login failed",
                            400
                        );
                    }
                }
            )(req, res, next);
        } catch (error) {
            return ResponseFormatter.error(res, error, "Login failed", 400);
        }
    };

    signUp = async (req, res, next) => {
        try {
            const payload = req.body;
            const user = await this.userService.register(payload);
            return ResponseFormatter.success(
                res,
                await this.exclude(user, ["password"]),
                "Sign up success and please verify your email first"
            );
        } catch (error) {
            return ResponseFormatter.error(res, error, "Sign up failed", 400);
        }
    };

    verifyEmail = async (req, res) => {
        try {
            const { token } = req.params;
            // return res.json(token);
            const user = await this.userService.verifyEmail(token);
            return ResponseFormatter.success(
                res,
                await this.exclude(user, ["password"]),
                "Email verified"
            );
        } catch (error) {
            return ResponseFormatter.error(
                res,
                error,
                "Email verification failed",
                400
            );
        }
    };

    resendEmailVerification = async (req, res) => {
        try {
            const { email } = req.body;
            const user = await this.userService.resendEmailVerification(email);
            return ResponseFormatter.success(
                res,
                await this.exclude(user, ["password"]),
                "Email verification sent"
            );
        } catch (error) {
            return ResponseFormatter.error(
                res,
                error,
                "Email verification failed",
                400
            );
        }
    };

    profile = async (req, res) => {
        try {
            return ResponseFormatter.success(
                res,
                await this.exclude(req.user, ["password"]),
                "Get profile success"
            );
        } catch (error) {
            return ResponseFormatter.error(
                res,
                error,
                "Get profile failed",
                400
            );
        }
    };
};

module.exports = new AuthController();
