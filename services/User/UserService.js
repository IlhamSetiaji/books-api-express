const UserRepository = require("../../repositories/User/UserRepository");
const NodeMailer = require("../../helpers/NodeMailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const UserService = class {
    constructor() {
        this.userRepository = new UserRepository();
        this.NodeMailer = NodeMailer;
        this.crypto = crypto;
    }

    delay = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };

    register = async (data) => {
        if (await this.userRepository.findByEmail(data.email)) {
            throw new Error("Email already used");
        }
        data.password = bcrypt.hashSync(data.password, 10);
        const user = await this.userRepository.register(data);
        setTimeout(async () => {
            await this.sendEmailVerification(user);
        }, 1000);
        return user;
    };

    generateToken = async (user) => {
        const token = await this.crypto.randomBytes(20).toString("hex");
        await this.userRepository.saveToken(user, token);
        return token;
    };

    sendEmailVerification = async (user) => {
        user = await this.userRepository.findByEmail(user.email);
        const token = await this.generateToken(user);
        await this.userRepository.saveToken(user, token);
        const url = `http://localhost:3000/api/auth/verify/${token}`;
        const mailOptions = {
            from: "ilham.ahmadz18@gmail.com",
            to: user.email,
            subject: "Email Verification",
            html: `<p>Click <a href="${url}">here</a> to verify your email</p>
            <p>Or copy this link to your browser</p>
            <p>${url}</p>`,
        };
        return await this.NodeMailer.sendMail(mailOptions);
    };

    verifyEmail = async (token) => {
        const user = await this.userRepository.findByToken(token);
        if (!user) {
            throw new Error("Invalid token");
        }
        await this.userRepository.verifyEmail(user);
        return user;
    };

    resendEmailVerification = async (email) => {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }
        if(user.emailVerifiedAt) {
            throw new Error("Email already verified");
        }
        setTimeout(async () => {
            await this.sendEmailVerification(user);
        }, 1000);
        return user;
    };

    resetPassword = async (email) => {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }
        const token = await this.generateToken(user);
        const url = `http://localhost:3000/api/auth/reset-password/${token}`;
        const mailOptions = {
            from: "ilham.ahmadz18@gmail.com",
            to: user.email,
            subject: "Reset Password",
            html: `<p>Click <a href="${url}">here</a> to reset your password</p>
            <p>Or copy this link to your browser</p>
            <p>${url}</p>`,
        };
        setTimeout(async () => {
            await this.NodeMailer.sendMail(mailOptions);
        }, 1000);
        return user;
    };

    resendPasswordReset = async (email) => {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }
        setTimeout(async () => {
            await this.resetPassword(user);
        }, 1000);
        return user;
    };

    changePassword = async (token, password) => {
        const user = await this.userRepository.findByToken(token);
        if (!user) {
            throw new Error("Invalid token");
        }
        password = bcrypt.hashSync(password, 10);
        await this.userRepository.changePassword(user, password);
        return user;
    };
};

module.exports = UserService;
