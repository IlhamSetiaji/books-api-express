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
}

module.exports = UserRepository;