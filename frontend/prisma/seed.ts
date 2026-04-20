import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {},
  });

  await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {},
  });

  await prisma.hero.upsert({
    where: { id: 1 },
    update: {},
    create: {},
  });

  await prisma.resumeAsset.upsert({
    where: { id: 1 },
    update: {},
    create: {
      highlights: JSON.stringify([
        'Undergraduate Computer Science student focused on AI/ML engineering',
        'Building foundations in LLM applications, machine learning, and MLOps',
        'Open to internships, research opportunities, and practical AI projects',
      ]),
    },
  });

  const categories = [
    ['AI and LLMs', ['LLM Fundamentals', 'Prompt Engineering', 'RAG Concepts']],
    ['Machine Learning', ['Python', 'Scikit-learn', 'Model Evaluation']],
    ['Data and MLOps', ['Pandas', 'Experiment Tracking', 'Deployment Basics']],
    ['Programming and Tools', ['TypeScript', 'Git', 'SQL']],
    ['Cloud and Deployment', ['Vercel', 'Docker Basics', 'API Design']],
  ] as const;

  for (let i = 0; i < categories.length; i++) {
    const [name, skills] = categories[i];
    const category = await prisma.skillCategory.upsert({
      where: { name },
      update: { sortOrder: i },
      create: { name, sortOrder: i },
    });

    for (let j = 0; j < skills.length; j++) {
      const existing = await prisma.skill.findFirst({
        where: { name: skills[j], categoryId: category.id },
      });
      if (!existing) {
        await prisma.skill.create({
          data: {
            name: skills[j],
            categoryId: category.id,
            proficiency: 70,
            sortOrder: j,
          },
        });
      }
    }
  }

  const projects = [
    {
      title: 'AI Portfolio Platform',
      slug: 'ai-portfolio-platform',
      description: 'An admin-managed professional portfolio for AI/ML engineering growth, projects, resume, and contact workflow.',
      category: 'Full Stack',
      techStack: JSON.stringify(['Next.js', 'Prisma', 'PostgreSQL', 'Vercel']),
      status: 'IN_PROGRESS' as const,
      featured: true,
      sortOrder: 0,
    },
    {
      title: 'ML Learning Lab',
      slug: 'ml-learning-lab',
      description: 'A growing collection of machine learning experiments, model evaluation notes, and reproducible notebooks.',
      category: 'Machine Learning',
      techStack: JSON.stringify(['Python', 'Scikit-learn', 'Pandas']),
      status: 'IN_PROGRESS' as const,
      featured: true,
      sortOrder: 1,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }

  await prisma.education.upsert({
    where: { id: 1 },
    update: {},
    create: {
      degree: 'B.Sc. in Computer Science',
      institution: 'Your University',
      period: 'Current',
      location: 'Bangladesh',
      coursework: JSON.stringify(['Data Structures', 'Algorithms', 'Database Systems', 'Machine Learning']),
      description: 'Coursework and projects focused on software engineering foundations and applied AI/ML growth.',
      sortOrder: 0,
    },
  });

  const socials = [
    { label: 'GitHub', platform: 'github', url: 'https://github.com/M-F-Tushar', sortOrder: 0 },
    { label: 'LinkedIn', platform: 'linkedin', url: 'https://www.linkedin.com/', sortOrder: 1 },
    { label: 'Email', platform: 'email', url: 'mailto:www.mahirfaysaltushar@gmail.com', sortOrder: 2 },
  ];

  for (const social of socials) {
    const existing = await prisma.socialLink.findFirst({ where: { platform: social.platform } });
    if (existing) {
      await prisma.socialLink.update({ where: { id: existing.id }, data: social });
    } else {
      await prisma.socialLink.create({ data: social });
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!ChangeMe123!';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash },
  });

  console.log(`Seed complete. Admin email: ${adminEmail}`);
  console.log('If you used the default password, change it immediately after login.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
