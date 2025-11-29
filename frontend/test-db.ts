import prisma from './lib/prisma';

async function testDatabase() {
    try {
        console.log('Testing database connection...\n');

        // Test Profile
        const profile = await prisma.profile.findFirst();
        console.log('✅ Profile:', profile?.name, '-', profile?.title);

        // Test Social Links
        const socialLinks = await prisma.socialLink.findMany();
        console.log('✅ Social Links:', socialLinks.length, 'found');

        // Test Skills
        const skills = await prisma.skill.findMany();
        console.log('✅ Skills:', skills.length, 'found');

        // Test Experience
        const experiences = await prisma.experience.findMany();
        console.log('✅ Experiences:', experiences.length, 'found');

        // Test Projects
        const projects = await prisma.project.findMany();
        console.log('✅ Projects:', projects.length, 'found');

        // Test Education
        const education = await prisma.education.findMany();
        console.log('✅ Education:', education.length, 'found');

        // Test Certifications
        const certifications = await prisma.certification.findMany();
        console.log('✅ Certifications:', certifications.length, 'found');

        console.log('\n✅ Database is working correctly!');

    } catch (error) {
        console.error('❌ Database error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testDatabase();
