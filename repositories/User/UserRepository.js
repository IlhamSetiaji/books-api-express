const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const UserRepository = class {

    constructor() {
        this.prisma = prisma;
    }

    findByEmail(email) {
        return this.prisma.user.findUnique({
            where: {
                email: email
            }
        });
    }

    register(data) {
        return this.prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: data.password
            }
        });
    }

    saveToken(user, token) {
        return this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                token: token
            }
        });
    }

    findByToken(token) {
        return this.prisma.user.findFirst({
            where: {
                token: token
            }
        });
    }

    verifyEmail(user) {
        return this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                token: null,
                emailVerifiedAt: new Date().toISOString()
            }
        });
    }
}

module.exports = UserRepository;