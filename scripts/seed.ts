const { PrismaClient } = require('@prisma/client');
const database = new PrismaClient();

async function main() {
    try {
        await database.category.createMany({
            data: [
                { name: 'Compute Science' },
                { name: 'Math' },
                { name: 'Physics' },
                { name: 'Chemistry' },
                { name: 'Biology' },
                { name: 'English' },
                { name: 'History' },
            ],
        });
    } catch (error) {
        console.log('Error seeding database categories: ', error);
    } finally {
        await database.$disconnect();
    }
}
main();

// run this by running `node scripts/seed.ts`
