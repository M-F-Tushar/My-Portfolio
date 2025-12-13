const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed...');

    // 1. Profile
    try {
        await prisma.profile.create({
            data: {
                name: "Your Name",
                title: "AI/ML Engineer",
                bio: "Building intelligent systems with LLMs, Deep Learning, and Production ML.",
                summary: "I'm an AI/ML engineer with experience building production-ready machine learning systems.",
                email: "your.email@example.com",
                location: "Your City, Country",
                yearsOfExperience: "3+",
                modelsDeployed: "15+",
            }
        });
        console.log('Profile created');
    } catch (e) {
        console.log('Profile might already exist, skipping...');
    }

    // 2. Social Links
    try {
        await prisma.socialLink.createMany({
            data: [
                { platform: "GitHub", url: "https://github.com", icon: "Github" },
                { platform: "LinkedIn", url: "https://linkedin.com", icon: "Linkedin" },
                { platform: "Email", url: "mailto:test@example.com", icon: "Mail" },
            ]
        });
        console.log('Social Links created');
    } catch (e) { }

    // 3. User (Admin)
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.user.create({
            data: {
                username: 'admin',
                email: 'admin@example.com',
                password: hashedPassword,
                role: 'admin'
            }
        });
        console.log('Admin user created');
    } catch (e) {
        console.log('Admin user likely exists');
    }

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
