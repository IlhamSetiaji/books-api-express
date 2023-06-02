const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        prisma.user
            .findUnique({ where: { id: id } })
            .then(function (user) {
                done(null, user);
            })
            .catch(function (err) {
                done(err, null);
            });
    });

    // local login
    passport.use(
        "local-login",
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password",
            },
            async (email, password, done) => {
                try {
                    const user = await prisma.user.findUnique({
                        where: { email: email },
                    });
                    if (!user) {
                        return done(null, false, {
                            message: "Email not found",
                        });
                    }
                    if (!bcrypt.compareSync(password, user.password)) {
                        return done(null, false, {
                            message: "Incorrect password",
                        });
                    }
                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.use(
        "local-signup",
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password",
                passReqToCallback: true,
            },
            async (req, email, password, done) => {
                try {
                    const user = await prisma.user.findUnique({
                        where: { email: email },
                    });
                    if (user) {
                        return done(null, false, {
                            message: "Email already taken",
                        });
                    }
                    const newUser = await prisma.user.create({
                        data: {
                            email: email,
                            name: req.body.name,
                            password: bcrypt.hashSync(password, 10),
                        },
                    });
                    return done(null, newUser);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    // jwt
    passport.use(
        new JWTStrategy(
            {
                secretOrKey: "authToken",
                jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            },
            async (token, done) => {
                try {
                    const user = await prisma.user.findUnique({
                        where: { id: token.id },
                    });
                    if (!user) {
                        return done(null, false, {
                            message: "User not found",
                        });
                    }
                    return done(null, user);
                } catch (error) {
                    done(error);
                }
            }
        )
    );
};
