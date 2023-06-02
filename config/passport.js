const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        // prisma.user({ id: id }).then(function(user) {
        //     done(null, user);
        // }).catch(function(err) {
        //     done(err, null);
        // });
        prisma.user
            .findUnique({ where: { id: id } })
            .then(function (user) {
                done(null, user);
            })
            .catch(function (err) {
                done(err, null);
            });
    });

    // local signup
    passport.use(
        "local-signup",
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password",
                passReqToCallback: true,
            },
            function (req, email, password, done) {
                prisma.user
                    .findUnique({ where: { email: email } })
                    .then(function (user) {
                        if (user) {
                            return done(
                                null,
                                false,
                                req.flash(
                                    "signupMessage",
                                    "That email is already taken."
                                )
                            );
                        } else {
                            prisma.user
                                .create({
                                    data: {
                                        email: email,
                                        name: req.body.name,
                                        password: bcrypt.hashSync(password, 10),
                                    },
                                })
                                .then(function (newUser) {
                                    return done(null, newUser);
                                })
                                .catch(function (err) {
                                    return done(err);
                                });
                        }
                    })
                    .catch(function (err) {
                        return done(err);
                    });
            }
        )
    );

    passport.use(
        "local-login",
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password",
                passReqToCallback: true,
            },
            function (req, email, password, done) {
                prisma.user
                    .findUnique({ where: { email: email } })
                    .then(function (user) {
                        if (!user) {
                            return done(
                                null,
                                false,
                                req.flash("loginMessage", "No user found.")
                            );
                        } else if (
                            !bcrypt.compareSync(password, user.password)
                        ) {
                            return done(
                                null,
                                false,
                                req.flash(
                                    "loginMessage",
                                    "Oops! Wrong password."
                                )
                            );
                        } else {
                            return done(null, user);
                        }
                    })
                    .catch(function (err) {
                        return done(err);
                    });
            }
        )
    );
};
