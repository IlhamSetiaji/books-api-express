const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

main = async() => {
    const sabik = await prisma.user.create({
        data: {
            name: 'Adri Sabik',
            email: 'adri@test.test',
            password: await bcrypt.hash('password', 10),
            emailVerifiedAt: new Date().toISOString()
        }
    });

    const refi = await prisma.user.create({
        data: {
            name: 'Refinaldy Madras',
            email: 'refi@test.test',
            password: await bcrypt.hash('password', 10),
            emailVerifiedAt: new Date().toISOString()
        }
    });
    console.log({ sabik, refi });
}

main().then(async() => {
    console.log('Seeding completed.');
    await prisma.$disconnect();
}).catch(async(e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
});