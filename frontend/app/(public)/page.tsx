import Link from 'next/link';
import {
  ArrowUpRight,
  BrainCircuit,
  BriefcaseBusiness,
  Cpu,
  GitBranch,
  GraduationCap,
  Layers3,
  LineChart,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';
import { prisma } from '@/lib/db';
import { parseStringArray } from '@/lib/content/json';
import { hasDatabaseUrl } from '@/lib/env';
import PublicNav from '@/components/public/PublicNav';
import HeroVisual from '@/components/public/HeroVisual';
import SectionReveal from '@/components/public/SectionReveal';
import ProjectCard, { type ProjectCardProject } from '@/components/public/ProjectCard';
import ContactForm from '@/components/public/ContactForm';

export const dynamic = 'force-dynamic';

const fallbackProfile = {
  displayName: 'Mahir Faysal Tusher',
  role: 'Undergraduate CS Student | AI/ML Engineering Path',
  about: 'LLM apps, ML systems, Python, RAG, evaluation, MLOps.',
  location: 'Chandpur, Bangladesh',
  currentFocus: 'LLMs, machine learning systems, production-ready AI workflows, and MLOps foundations.',
};

const fallbackHero = {
  eyebrow: 'AI Engineering Portfolio',
  headline: 'AI / ML Engineering',
  subheadline: 'Undergraduate CS student focused on LLM apps, machine learning systems, and MLOps foundations.',
  primaryLabel: 'View Projects',
  primaryHref: '/projects',
  secondaryLabel: 'Preview Resume',
  secondaryHref: '/resume',
  featuredChips: '["LLM Apps","Machine Learning","MLOps","RAG","Python"]',
};

const fallbackProjects: ProjectCardProject[] = [
  {
    title: 'AI Portfolio Platform',
    description: 'CMS portfolio / resume / contact workflow.',
    category: 'Full Stack',
    techStack: '["Next.js","Prisma","PostgreSQL","Vercel"]',
    status: 'IN_PROGRESS',
    caseStudyUrl: null,
    githubUrl: null,
    liveDemoUrl: null,
  },
  {
    title: 'ML Learning Lab',
    description: 'Model evaluation / notebooks / experiments.',
    category: 'Machine Learning',
    techStack: '["Python","Scikit-learn","Pandas"]',
    status: 'IN_PROGRESS',
    caseStudyUrl: null,
    githubUrl: null,
    liveDemoUrl: null,
  },
];

const candidateSignals = [
  { label: 'Direction', value: 'AI Engineering', icon: BrainCircuit },
  { label: 'Strength', value: 'ML Systems', icon: Cpu },
  { label: 'Production focus', value: 'MLOps', icon: GitBranch },
  { label: 'Output', value: 'Projects + Resume', icon: ShieldCheck },
];

const aboutScanTags = ['LLM Apps', 'ML Systems', 'Python', 'RAG', 'Evaluation', 'MLOps'];

const fallbackExperienceTimeline = [
  {
    period: 'Current',
    role: 'AI/ML portfolio builder',
    organization: 'Project-based learning',
    summary: 'Building employer-facing projects around LLM apps, model evaluation, and deployment workflows.',
  },
  {
    period: 'Next',
    role: 'Internship-ready engineering path',
    organization: 'Applied AI systems',
    summary: 'Preparing practical demos, case-study links, and measurable project outcomes for technical review.',
  },
];

const fallbackEducationTimeline = [
  {
    period: 'Foundation',
    degree: 'Computer Science fundamentals',
    institution: 'Programming, data structures, algorithms, databases, and software engineering.',
  },
  {
    period: 'Specialization',
    degree: 'AI/ML engineering track',
    institution: 'Machine learning, LLM applications, MLOps foundations, evaluation, and deployment thinking.',
  },
  {
    period: 'Professional proof',
    degree: 'Portfolio + resume evidence',
    institution: 'Projects, certifications, achievements, and hackathons become public when ready.',
  },
];

async function loadHomeData() {
  const fallbackData = {
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

  if (!hasDatabaseUrl()) {
    return fallbackData;
  }

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
    return fallbackData;
  }
}

export default async function HomePage() {
  const data = await loadHomeData();
  const chips = parseStringArray(data.hero.featuredChips);
  const heroTags = chips.length ? chips : ['LLM Apps', 'Machine Learning', 'MLOps'];
  const experienceTimeline = data.experience.length ? data.experience : fallbackExperienceTimeline;
  const educationTimeline = data.education.length ? data.education : fallbackEducationTimeline;
  const aboutSignals = [
    { label: 'Role', value: data.profile.role, icon: BriefcaseBusiness },
    { label: 'Location', value: data.profile.location, icon: Target },
    { label: 'Focus', value: data.profile.currentFocus, icon: Sparkles },
  ];

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
              <span className="block text-gradient">AI / ML Engineering</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{data.hero.subheadline}</p>
            <div className="mt-7 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {candidateSignals.map((signal) => {
                const Icon = signal.icon;

                return (
                  <div key={signal.label} className="signal-tile group">
                    <Icon className="h-4 w-4 text-cyan-200 transition group-hover:scale-110" />
                    <span className="text-[0.65rem] uppercase tracking-[0.2em] text-slate-500">{signal.label}</span>
                    <strong className="text-sm text-white">{signal.value}</strong>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={data.hero.primaryHref || '/projects'} className="rounded-md bg-cyan-300 px-5 py-3 font-medium text-slate-950 transition-colors hover:bg-cyan-200">
                {data.hero.primaryLabel || 'View Projects'}
              </Link>
              <Link href={data.hero.secondaryHref || '/resume'} className="rounded-md border border-cyan-200/25 px-5 py-3 font-medium text-cyan-100 transition-colors hover:border-cyan-200/60">
                {data.hero.secondaryLabel || 'Resume'}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {heroTags.map((chip) => (
                <span key={chip} className="rounded-md border border-cyan-200/20 bg-cyan-200/8 px-3 py-1 text-sm text-cyan-100">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </section>

        <SectionReveal id="about" className="container-wide py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-emerald-200">About</p>
              <h2 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight text-white md:text-5xl">
                AI / ML Systems
              </h2>
              <div className="mt-6 flex max-w-3xl flex-wrap gap-2">
                {aboutScanTags.map((tag) => (
                  <span key={tag} className="rounded-md border border-cyan-200/25 bg-cyan-200/8 px-3 py-1.5 text-sm font-medium text-cyan-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="evidence-board">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Profile</p>
                  <p className="mt-1 text-sm text-slate-400">Role / location / focus</p>
                </div>
                <LineChart className="h-5 w-5 text-emerald-200" />
              </div>
              <div className="grid gap-px bg-white/10 sm:grid-cols-3">
                {aboutSignals.map((signal) => {
                  const Icon = signal.icon;

                  return (
                    <div key={signal.label} className="bg-slate-950/78 p-5">
                      <Icon className="h-5 w-5 text-cyan-200" />
                      <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">{signal.label}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-100">{signal.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </SectionReveal>

        <SectionReveal id="skills" className="container-wide py-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Skills</p>
              <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">Technical Stack</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-400">
              LLMs / ML / MLOps / Python
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.skillCategories.map((category) => (
              <div key={category.id} className="skill-panel group">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-cyan-100">{category.name}</h3>
                  <Sparkles className="h-4 w-4 text-emerald-200 opacity-70 transition group-hover:opacity-100" />
                </div>
                <div className="mt-5 h-1.5 overflow-hidden rounded-lg bg-white/8">
                  <div className="h-full w-4/5 rounded-lg bg-gradient-to-r from-cyan-300 to-emerald-300" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span key={skill.id} className="rounded-md border border-cyan-200/10 bg-cyan-200/8 px-2 py-1 text-xs text-slate-200 transition group-hover:border-cyan-200/25">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal id="featured-projects" className="container-wide py-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Featured Projects</p>
              <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">Projects</h2>
              <p className="mt-2 text-slate-400">Domain / stack / status / links</p>
            </div>
            <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-white">
              View all projects
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {data.projects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </SectionReveal>

        <SectionReveal id="experience" className="container-wide py-20">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-emerald-200">Experience</p>
              <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">Experience</h2>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Timeline / projects / applied systems
              </p>
            </div>
            <div className="timeline-list">
              {experienceTimeline.map((item, index) => (
                <div key={`${item.role}-${item.period}`} className="timeline-item">
                  <div className="timeline-node">{String(index + 1).padStart(2, '0')}</div>
                  <div className="timeline-content">
                    <p className="text-sm text-cyan-200">{item.period}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{item.role}</h3>
                    <p className="text-slate-300">{item.organization}</p>
                    {item.summary ? <p className="mt-3 text-sm leading-6 text-slate-400">{item.summary}</p> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>

        <SectionReveal id="education" className="container-wide py-20">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Education</p>
              <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">Education</h2>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                CS core / AI/ML focus / credentials
              </p>
            </div>
            <div className="timeline-list">
              {educationTimeline.map((item, index) => (
                <div key={`${item.degree}-${item.period}`} className="timeline-item">
                  <div className="timeline-node">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <div className="timeline-content">
                    <p className="text-sm text-cyan-200">{item.period}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{item.degree}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.institution}</p>
                    {'gpa' in item && typeof item.gpa === 'string' && item.gpa ? (
                      <p className="mt-2 text-sm text-emerald-200">GPA: {item.gpa}</p>
                    ) : null}
                  </div>
                </div>
              ))}
              {data.certifications.map((item) => (
                <div key={item.id} className="timeline-item">
                  <div className="timeline-node">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div className="timeline-content">
                    <p className="text-sm text-emerald-200">{item.date ?? 'Certification'}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{item.name}</h3>
                    {item.issuer ? <p className="mt-2 text-sm text-slate-300">{item.issuer}</p> : null}
                  </div>
                </div>
              ))}
            </div>
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

        <SectionReveal id="contact" className="container-wide py-20">
          <div className="contact-band">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Contact</p>
              <h2 className="mt-3 text-4xl font-semibold leading-tight text-white md:text-5xl">
                Open to internships, research, and AI project work.
              </h2>
              <p className="mt-4 max-w-xl text-slate-300">Messages are saved privately in the admin panel for review.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Availability', value: 'Internship' },
                  { label: 'Direction', value: 'AI/ML' },
                  { label: 'Response', value: 'Private inbox' },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                    <p className="mt-2 text-sm font-semibold text-cyan-100">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-2 text-sm text-slate-300">
                {data.socials.map((social) => (
                  <Link key={social.id} href={social.url} className="inline-flex items-center gap-2 text-cyan-200 hover:text-white">
                    {social.label}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            </div>
            <ContactForm />
          </div>
        </SectionReveal>
      </main>
    </div>
  );
}
