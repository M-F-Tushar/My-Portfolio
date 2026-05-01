import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowUpRight,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  Cpu,
  Download,
  GitBranch,
  GraduationCap,
  Layers3,
  LineChart,
  Mail,
  MapPin,
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
  email: 'mahirfaysaltushar@gmail.com',
  currentFocus: 'LLMs, machine learning systems, production-ready AI workflows, and MLOps foundations.',
  yearsLabel: 'CS Undergraduate',
  projectsLabel: 'AI/ML Projects',
  profileImage: null,
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

const workflowStages = [
  { label: 'Prompt', detail: 'User goal + context', icon: Sparkles },
  { label: 'Retrieval', detail: 'Docs / data / memory', icon: Layers3 },
  { label: 'Model', detail: 'LLM or ML pipeline', icon: BrainCircuit },
  { label: 'Eval', detail: 'Quality + reliability', icon: LineChart },
];

const modelOutputs = ['RAG', 'Evaluation', 'MLOps', 'Deployment'];

const orbitSignals = ['RAG', 'Tokens', 'Vectors', 'Eval', 'MLOps'];

const processSteps = [
  {
    title: 'Scope',
    body: 'Define the role signal, project goal, and measurable outcome.',
    icon: Target,
  },
  {
    title: 'Build',
    body: 'Ship the smallest working AI/ML system with clean engineering habits.',
    icon: Cpu,
  },
  {
    title: 'Evaluate',
    body: 'Review outputs, data flow, reliability, and deployment readiness.',
    icon: LineChart,
  },
  {
    title: 'Publish',
    body: 'Turn the work into a project card, resume point, and case-study link.',
    icon: Rocket,
  },
];

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
      prisma.profile.findUnique({
        where: { id: 1 },
        include: { profileImage: true },
      }),
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

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default async function HomePage() {
  const data = await loadHomeData();
  const chips = parseStringArray(data.hero.featuredChips);
  const heroTags = chips.length ? chips : ['LLM Apps', 'Machine Learning', 'MLOps'];
  const experienceTimeline = data.experience.length ? data.experience : fallbackExperienceTimeline;
  const educationTimeline = data.education.length ? data.education : fallbackEducationTimeline;
  const profileImageUrl = data.profile.profileImage?.url ?? null;
  const initials = getInitials(data.profile.displayName);
  const heroMetrics = [
    { value: 'CS', label: 'Undergraduate' },
    { value: 'AI/ML', label: 'Engineering path' },
    { value: `${data.skillCategories.length}`, label: 'Skill clusters' },
    { value: `${data.projects.length}+`, label: 'Projects' },
  ];
  const aboutSignals = [
    { label: 'Role', value: data.profile.role, icon: BriefcaseBusiness },
    { label: 'Location', value: data.profile.location, icon: Target },
    { label: 'Focus', value: data.profile.currentFocus, icon: Sparkles },
  ];

  return (
    <div className="cinematic-shell">
      <PublicNav />
      <main>
        <section className="portfolio-hero">
          <HeroVisual />
          <div className="container-wide relative z-10">
            <div className="hero-arrangement">
              <div className="hero-copy">
                <span className="status-pill">
                  <Sparkles className="h-3.5 w-3.5" />
                  Available for AI/ML opportunities
                </span>
                <p className="mt-7 text-sm uppercase tracking-[0.28em] text-cyan-200">{data.hero.eyebrow}</p>
                <h1 className="mt-3 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-white md:text-7xl">
                  {data.profile.displayName}
                </h1>
                <p className="mt-5 text-xl font-semibold text-cyan-200">{data.profile.role}</p>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">{data.hero.subheadline}</p>
                <div className="mt-7 grid max-w-2xl grid-cols-2 gap-4 md:grid-cols-4">
                  {heroMetrics.map((metric) => (
                    <div key={metric.label} className="metric-block">
                      <strong>{metric.value}</strong>
                      <span>{metric.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={data.hero.primaryHref || '/projects'} className="action-primary">
                    {data.hero.primaryLabel || 'View Projects'}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link href={data.hero.secondaryHref || '/resume'} className="action-secondary">
                    {data.hero.secondaryLabel || 'Resume'}
                    <Download className="h-4 w-4" />
                  </Link>
                </div>
                <div className="mt-8 flex flex-wrap gap-2">
                  {heroTags.map((chip) => (
                    <span key={chip} className="tech-chip">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div className="hero-ai-stage" aria-label="AI engineering neural system visual">
                <div className="ai-stage-field">
                  <div className="portrait-system">
                    <div className="portrait-core">
                      <span className="portrait-initials">{initials}</span>
                      {profileImageUrl ? (
                        <Image
                          src={profileImageUrl}
                          alt={data.profile.displayName}
                          fill
                          sizes="(min-width: 1024px) 15rem, 12rem"
                          className="object-cover"
                          priority
                          unoptimized
                        />
                      ) : null}
                    </div>
                    {orbitSignals.map((signal, index) => (
                      <span key={signal} className={`orbit-signal orbit-signal-${index + 1}`}>
                        {signal}
                      </span>
                    ))}
                  </div>

                  <div className="llm-system-map">
                    {workflowStages.map((stage, index) => {
                      const Icon = stage.icon;

                      return (
                        <div key={stage.label} className="llm-layer">
                          <span>{String(index + 1).padStart(2, '0')}</span>
                          <Icon className="h-4 w-4 text-cyan-200" />
                          <div>
                            <strong>{stage.label}</strong>
                            <small>{stage.detail}</small>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="ai-output-strip">
                    {modelOutputs.map((output) => (
                      <span key={output}>{output}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionReveal id="about" className="portfolio-section">
          <div className="container-wide">
            <div className="about-arrangement">
              <aside className="about-signal-panel">
                <div className="signal-header">
                  <span>{initials}</span>
                  <div>
                    <p>Candidate Signal</p>
                    <strong>{data.profile.displayName}</strong>
                  </div>
                </div>
                <div className="signal-pill-row">
                  {aboutScanTags.slice(0, 5).map((tag) => (
                    <span key={tag} className="tech-chip compact">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="signal-list">
                  <div>
                    <MapPin className="h-4 w-4" />
                    <span>{data.profile.location}</span>
                  </div>
                  <div>
                    <Mail className="h-4 w-4" />
                    <span>{data.profile.email}</span>
                  </div>
                  {candidateSignals.map((signal) => {
                    const Icon = signal.icon;

                    return (
                      <div key={signal.label}>
                        <Icon className="h-4 w-4" />
                        <span>{signal.label}</span>
                        <strong>{signal.value}</strong>
                      </div>
                    );
                  })}
                </div>
              </aside>

              <div className="about-copy">
                <p className="section-kicker">About</p>
                <h2>Applied AI/ML systems with a computer science foundation.</h2>
                <p>
                  {data.profile.about || 'LLM apps, ML systems, Python, RAG, evaluation, and MLOps.'}
                </p>
                <p>
                  The portfolio is arranged around employer-readable evidence: technical direction, project cards,
                  stack visibility, resume access, and a private contact workflow.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {aboutSignals.map((signal) => {
                    const Icon = signal.icon;

                    return (
                      <div key={signal.label} className="info-tile">
                        <Icon className="h-5 w-5 text-cyan-200" />
                        <span>{signal.label}</span>
                        <strong>{signal.value}</strong>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </SectionReveal>

        <SectionReveal id="skills" className="portfolio-section">
          <div className="container-wide">
            <div className="section-heading-row">
              <div>
                <p className="section-kicker">Capabilities</p>
                <h2>Technical Stack</h2>
              </div>
              <p>LLMs / ML / MLOps / Python</p>
            </div>
            <div className="capability-grid">
              {data.skillCategories.map((category) => (
                <div key={category.id} className="skill-panel group">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-cyan-100">{category.name}</h3>
                    <Layers3 className="h-4 w-4 text-emerald-200 opacity-75 transition group-hover:opacity-100" />
                  </div>
                  <div className="mt-5 h-1.5 overflow-hidden rounded-lg bg-white/8">
                    <div className="h-full w-4/5 rounded-lg bg-gradient-to-r from-cyan-300 to-emerald-300" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span key={skill.id} className="tech-chip compact">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>

        <SectionReveal id="featured-projects" className="portfolio-section">
          <div className="container-wide">
            <div className="section-heading-row">
              <div>
                <p className="section-kicker">Selected Work</p>
                <h2>Projects</h2>
              </div>
              <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-white">
                View all projects
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="project-grid">
              {data.projects.map((project) => (
                <ProjectCard key={project.title} project={project} />
              ))}
            </div>
          </div>
        </SectionReveal>

        <SectionReveal className="portfolio-section">
          <div className="container-wide">
            <div className="section-heading-row">
              <div>
                <p className="section-kicker">Process</p>
                <h2>How I build proof.</h2>
              </div>
              <p>Scope / build / evaluate / publish</p>
            </div>
            <div className="process-grid">
              {processSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div key={step.title} className="process-step">
                    <div className="process-number">{index + 1}</div>
                    <Icon className="h-5 w-5 text-cyan-200" />
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </SectionReveal>

        <SectionReveal id="experience" className="portfolio-section">
          <div className="container-wide">
            <div className="section-heading-row">
              <div>
                <p className="section-kicker">Background</p>
                <h2>Experience</h2>
              </div>
              <p>Timeline / projects / applied systems</p>
            </div>
            <div className="portfolio-timeline">
              {experienceTimeline.map((item, index) => (
                <div key={`${item.role}-${item.period}`} className="timeline-row">
                  <div className="timeline-point">{String(index + 1).padStart(2, '0')}</div>
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

        <SectionReveal id="education" className="portfolio-section">
          <div className="container-wide">
            <div className="section-heading-row">
              <div>
                <p className="section-kicker">Education</p>
                <h2>CS foundation and AI/ML focus.</h2>
              </div>
              <p>Coursework / credentials / portfolio evidence</p>
            </div>
            <div className="education-grid">
              {educationTimeline.map((item) => (
                <div key={`${item.degree}-${item.period}`} className="education-card">
                  <GraduationCap className="h-5 w-5 text-cyan-200" />
                  <p>{item.period}</p>
                  <h3>{item.degree}</h3>
                  <span>{item.institution}</span>
                  {'gpa' in item && typeof item.gpa === 'string' && item.gpa ? (
                    <strong>GPA: {item.gpa}</strong>
                  ) : null}
                </div>
              ))}
              {data.certifications.map((item) => (
                <div key={item.id} className="education-card">
                  <ShieldCheck className="h-5 w-5 text-emerald-200" />
                  <p>{item.date ?? 'Certification'}</p>
                  <h3>{item.name}</h3>
                  {item.issuer ? <span>{item.issuer}</span> : null}
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>

        {data.achievements.length > 0 ? (
          <SectionReveal className="portfolio-section">
            <div className="container-wide">
              <p className="section-kicker">Achievements</p>
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
            </div>
          </SectionReveal>
        ) : null}

        <SectionReveal id="contact" className="portfolio-section">
          <div className="container-wide">
            <div className="contact-band">
              <div>
                <p className="section-kicker">Contact</p>
                <h2 className="mt-3 text-4xl font-semibold leading-tight text-white md:text-5xl">
                  Start a conversation.
                </h2>
                <p className="mt-4 max-w-xl text-slate-300">
                  Open to internships, research, and AI project work. Messages are saved privately for review.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: 'Availability', value: 'Internship' },
                    { label: 'Direction', value: 'AI/ML' },
                    { label: 'Response', value: 'Private inbox' },
                  ].map((item) => (
                    <div key={item.label} className="info-tile small">
                      <CheckCircle2 className="h-4 w-4 text-cyan-200" />
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-col gap-2 text-sm text-slate-300">
                  <Link href={`mailto:${data.profile.email}`} className="inline-flex items-center gap-2 text-cyan-200 hover:text-white">
                    <Mail className="h-4 w-4" />
                    {data.profile.email}
                  </Link>
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
          </div>
        </SectionReveal>

        <section className="final-cta">
          <div className="container-wide text-center">
            <p className="section-kicker">Next Step</p>
            <h2>Ready to review AI/ML project evidence?</h2>
            <p>Explore projects, preview the resume, or send a direct message.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/projects" className="action-primary">
                View Projects
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/resume" className="action-secondary">
                Preview Resume
                <Download className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="portfolio-footer">
        <div className="container-wide">
          <div>
            <h2>{data.profile.displayName}</h2>
            <p>{data.profile.role}</p>
          </div>
          <div className="footer-links">
            {[
              { label: 'Home', href: '/' },
              { label: 'Projects', href: '/projects' },
              { label: 'Resume', href: '/resume' },
              { label: 'Contact', href: '/#contact' },
            ].map((link) => (
              <Link key={link.label} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
