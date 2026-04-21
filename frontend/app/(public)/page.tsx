import Link from 'next/link';
import { prisma } from '@/lib/db';
import { parseStringArray } from '@/lib/content/json';
import PublicNav from '@/components/public/PublicNav';
import HeroVisual from '@/components/public/HeroVisual';
import SectionReveal from '@/components/public/SectionReveal';
import ProjectCard, { type ProjectCardProject } from '@/components/public/ProjectCard';
import ContactForm from '@/components/public/ContactForm';

export const dynamic = 'force-dynamic';

const fallbackProfile = {
  displayName: 'Mahir Faysal Tusher',
  role: 'Undergraduate CS Student | AI/ML Engineering Path',
  about:
    'I am building a professional foundation in AI Engineering, ML Engineering, LLM applications, and MLOps through projects, coursework, and continuous experimentation.',
  location: 'Chandpur, Bangladesh',
  currentFocus: 'LLMs, machine learning systems, production-ready AI workflows, and MLOps foundations.',
};

const fallbackHero = {
  eyebrow: 'AI Engineering Portfolio',
  headline: 'Building practical AI systems from classroom foundations to production thinking.',
  subheadline: 'Undergraduate CS student focused on LLMs, machine learning, and MLOps.',
  primaryLabel: 'View Projects',
  primaryHref: '/projects',
  secondaryLabel: 'Preview Resume',
  secondaryHref: '/resume',
  featuredChips: '["LLMs","Machine Learning","MLOps"]',
};

const fallbackProjects: ProjectCardProject[] = [
  {
    title: 'AI Portfolio Platform',
    description:
      'An admin-managed professional portfolio for AI/ML engineering growth, projects, resume, and contact workflow.',
    category: 'Full Stack',
    techStack: '["Next.js","Prisma","PostgreSQL","Vercel"]',
    status: 'IN_PROGRESS',
    caseStudyUrl: null,
    githubUrl: null,
    liveDemoUrl: null,
  },
  {
    title: 'ML Learning Lab',
    description:
      'A growing collection of machine learning experiments, model evaluation notes, and reproducible notebooks.',
    category: 'Machine Learning',
    techStack: '["Python","Scikit-learn","Pandas"]',
    status: 'IN_PROGRESS',
    caseStudyUrl: null,
    githubUrl: null,
    liveDemoUrl: null,
  },
];

async function loadHomeData() {
  try {
    const [
      profile,
      hero,
      skillCategories,
      projects,
      experience,
      education,
      certifications,
      achievements,
      socials,
    ] = await Promise.all([
      prisma.profile.findUnique({ where: { id: 1 } }),
      prisma.hero.findUnique({ where: { id: 1 } }),
      prisma.skillCategory.findMany({
        where: { visible: true },
        include: { skills: { where: { visible: true }, orderBy: { sortOrder: 'asc' } } },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.project.findMany({
        where: { visible: true, featured: true },
        orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
        take: 6,
      }),
      prisma.experience.findMany({ where: { visible: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.education.findMany({ where: { visible: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.certification.findMany({ where: { visible: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.achievement.findMany({ where: { visible: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.socialLink.findMany({ where: { visible: true }, orderBy: { sortOrder: 'asc' } }),
    ]);

    return {
      profile: profile ?? fallbackProfile,
      hero: hero ?? fallbackHero,
      skillCategories,
      projects: projects.length ? projects : fallbackProjects,
      experience,
      education,
      certifications,
      achievements,
      socials,
    };
  } catch {
    return {
      profile: fallbackProfile,
      hero: fallbackHero,
      skillCategories: [
        { id: 1, name: 'AI and LLMs', skills: [{ id: 1, name: 'LLM Fundamentals' }, { id: 2, name: 'RAG Concepts' }] },
        { id: 2, name: 'Machine Learning', skills: [{ id: 3, name: 'Python' }, { id: 4, name: 'Model Evaluation' }] },
        { id: 3, name: 'MLOps Foundations', skills: [{ id: 5, name: 'Experiment Tracking' }, { id: 6, name: 'Deployment Basics' }] },
      ],
      projects: fallbackProjects,
      experience: [],
      education: [],
      certifications: [],
      achievements: [],
      socials: [],
    };
  }
}

export default async function HomePage() {
  const data = await loadHomeData();
  const chips = parseStringArray(data.hero.featuredChips);

  return (
    <div className="cinematic-shell">
      <PublicNav />
      <main>
        <section className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden px-4 py-24">
          <HeroVisual />
          <div className="container-wide relative z-10">
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">{data.hero.eyebrow}</p>
            <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.95] tracking-tight text-white md:text-7xl">
              {data.profile.displayName}
              <span className="block text-gradient">{data.hero.headline}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{data.hero.subheadline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={data.hero.primaryHref || '/projects'} className="rounded-md bg-cyan-300 px-5 py-3 font-medium text-slate-950 transition-colors hover:bg-cyan-200">
                {data.hero.primaryLabel || 'View Projects'}
              </Link>
              <Link href={data.hero.secondaryHref || '/resume'} className="rounded-md border border-cyan-200/25 px-5 py-3 font-medium text-cyan-100 transition-colors hover:border-cyan-200/60">
                {data.hero.secondaryLabel || 'Resume'}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span key={chip} className="rounded-md border border-cyan-200/20 px-3 py-1 text-sm text-cyan-100">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </section>

        <SectionReveal className="container-wide py-20">
          <p className="text-sm uppercase tracking-[0.28em] text-emerald-200">About</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">A computer science foundation aimed at production AI.</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{data.profile.about}</p>
          <div className="mt-6 grid gap-3 text-sm text-slate-300 md:grid-cols-3">
            <span className="glass-panel rounded-lg p-3">{data.profile.role}</span>
            <span className="glass-panel rounded-lg p-3">{data.profile.location}</span>
            <span className="glass-panel rounded-lg p-3">{data.profile.currentFocus}</span>
          </div>
        </SectionReveal>

        <SectionReveal className="container-wide py-20">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Skills</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">AI, ML, and software systems toolkit.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.skillCategories.map((category) => (
              <div key={category.id} className="glass-panel rounded-lg p-5 transition hover:border-cyan-200/35">
                <h3 className="font-semibold text-cyan-100">{category.name}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span key={skill.id} className="rounded-md bg-white/5 px-2 py-1 text-xs text-slate-200">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal className="container-wide py-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Featured Projects</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Practical work with employer-readable signal.</h2>
              <p className="mt-2 text-slate-400">Selected projects showing AI, ML, and engineering growth.</p>
            </div>
            <Link href="/projects" className="text-sm text-cyan-200 hover:text-white">View all projects</Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {data.projects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </SectionReveal>

        <SectionReveal className="container-wide py-20">
          <p className="text-sm uppercase tracking-[0.28em] text-emerald-200">Experience</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Applied learning and professional momentum.</h2>
          <div className="mt-8 space-y-4">
            {data.experience.length ? data.experience.map((item) => (
              <div key={item.id} className="glass-panel rounded-lg p-5">
                <p className="text-sm text-cyan-200">{item.period}</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{item.role}</h3>
                <p className="text-slate-300">{item.organization}</p>
                {item.summary ? <p className="mt-3 text-slate-400">{item.summary}</p> : null}
              </div>
            )) : (
              <p className="text-slate-400">Experience entries can be added from the admin panel when ready.</p>
            )}
          </div>
        </SectionReveal>

        <SectionReveal className="container-wide py-20">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Education</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Education and certification signal.</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {data.education.map((item) => (
              <div key={item.id} className="glass-panel rounded-lg p-5">
                <h3 className="text-xl font-semibold text-white">{item.degree}</h3>
                <p className="mt-2 text-slate-300">{item.institution}</p>
                <p className="text-sm text-cyan-200">{item.period}</p>
              </div>
            ))}
            {data.certifications.map((item) => (
              <div key={item.id} className="glass-panel rounded-lg p-5">
                <h3 className="text-xl font-semibold text-white">{item.name}</h3>
                {item.issuer ? <p className="mt-2 text-slate-300">{item.issuer}</p> : null}
              </div>
            ))}
          </div>
        </SectionReveal>

        {data.achievements.length > 0 ? (
          <SectionReveal className="container-wide py-20">
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-200">Achievements</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Achievements and hackathons.</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {data.achievements.map((item) => (
                <div key={item.id} className="glass-panel rounded-lg p-5">
                  <p className="text-sm capitalize text-cyan-200">{item.type.toLowerCase()}</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
                  {item.description ? <p className="mt-2 text-slate-300">{item.description}</p> : null}
                </div>
              ))}
            </div>
          </SectionReveal>
        ) : null}

        <SectionReveal id="contact" className="container-wide grid gap-8 py-20 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Contact</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Open to internships, research, and AI project work.</h2>
            <p className="mt-4 text-slate-300">Messages are saved privately in the admin panel for review.</p>
            <div className="mt-6 space-y-2 text-sm text-slate-300">
              {data.socials.map((social) => (
                <Link key={social.id} href={social.url} className="block text-cyan-200 hover:text-white">
                  {social.label}
                </Link>
              ))}
            </div>
          </div>
          <ContactForm />
        </SectionReveal>
      </main>
    </div>
  );
}
