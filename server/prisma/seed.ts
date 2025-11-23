import { Prisma, PrismaClient } from '@prisma/client';

// import "dotenv/config";
import dotenv from "dotenv";
dotenv.config({
    path: "../.env"
});
import bcrypt from "bcrypt";


const prisma = new PrismaClient();

async function buildDefaultValues(): Promise<Prisma.UserCreateInput[]> {
    const saltRounds = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10;

    



    const defaultUsers: Prisma.UserCreateInput[] = [
        {
            username: 'admin',
            password: await bcrypt.hash('adminpassword', saltRounds),

        }
    ];

    return defaultUsers;
}



async function insertDefaultValues() {
    const defaultUsers = await buildDefaultValues();

    for (const userData of defaultUsers) {
        await prisma.user.create({
            data: userData
        });
    }
}



try {
    console.log('Seeding database with default values...');
    await insertDefaultValues();
    console.log('Database seeding completed.');

} catch (error) {
    console.error('Error seeding database:', error);

} finally {
    prisma.$disconnect();

}