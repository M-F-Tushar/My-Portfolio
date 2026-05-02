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
import { homepageContentDefaults, parseLabelValueItems } from '@/lib/content/homepage';
import { hasDatabaseUrl } from '@/lib/env';
import PublicNav from '@/components/public/PublicNav';
import HeroVisual from '@/components/public/HeroVisual';
import SectionReveal from '@/components/public/SectionReveal';
import ProjectCard, { type ProjectCardProject } from '@/components/public/ProjectCard';
import ContactForm from '@/components/public/ContactForm';

export const revalidate = 60;

const DATABASE_READ_TIMEOUT_MS = 900;

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
    image: null,
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
    image: null,
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

function withDatabaseTimeout<T>(promise: Promise<T>) {
  let timer: ReturnType<typeof setTimeout>;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error('Database content read timed out'));
    }, DATABASE_READ_TIMEOUT_MS);
  });

  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    timeout,
  ]);
}

async function loadHomeData() {
  const fallbackData = {
    profile: fallbackProfile,
    hero: fallbackHero,
    skillCategories: [
      { id: 1, name: 'AI and LLMs', skills: [{ id: 1, name: 'LLM Fundamentals', proficiency: 70 }, { id: 2, name: 'RAG Concepts', proficiency: 70 }] },
      { id: 2, name: 'Machine Learning', skills: [{ id: 3, name: 'Python', proficiency: 70 }, { id: 4, name: 'Model Evaluation', proficiency: 70 }] },
      { id: 3, name: 'MLOps Foundations', skills: [{ id: 5, name: 'Experiment Tracking', proficiency: 70 }, { id: 6, name: 'Deployment Basics', proficiency: 70 }] },
    ],
    homepage: homepageContentDefaults,
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
      homepage,
      skillCategories,
      projects,
      experience,
      education,
      certifications,
      achievements,
      socials,
    ] = await withDatabaseTimeout(Promise.all([
      prisma.profile.findUnique({
        where: { id: 1 },
        include: { profileImage: true },
      }),
      prisma.hero.findUnique({ where: { id: 1 } }),
      prisma.homepageContent.findUnique({ where: { id: 1 } }),
      prisma.skillCategory.findMany({
        where: { visible: true },
        include: { skills: { where: { visible: true }, orderBy: { sortOrder: 'asc' } } },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.project.findMany({
        where: { visible: true, featured: true },
        include: { image: true },
        orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
        take: 6,
      }),
      prisma.experience.findMany({ where: { visible: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.education.findMany({ where: { visible: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.certification.findMany({ where: { visible: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.achievement.findMany({ where: { visible: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.socialLink.findMany({ where: { visible: true }, orderBy: { sortOrder: 'asc' } }),
    ]));

    return {
      profile: profile ?? fallbackProfile,
      hero: hero ?? fallbackHero,
      homepage: homepage ?? homepageContentDefaults,
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

function clampPercent(value: number | null | undefined) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 70;
  }

  return Math.min(100, Math.max(0, value));
}

export default async function HomePage() {
  const data = await loadHomeData();
  const content = data.homepage;
  const chips = parseStringArray(data.hero.featuredChips);
  const heroTags = chips.length ? chips : ['LLM Apps', 'Machine Learning', 'MLOps'];
  const heroOrbitSignals = parseStringArray(content.heroOrbitSignals).length
    ? parseStringArray(content.heroOrbitSignals).slice(0, 5)
    : parseStringArray(homepageContentDefaults.heroOrbitSignals);
  const workflowIcons = [Sparkles, Layers3, BrainCircuit, LineChart];
  const workflowStages = parseLabelValueItems(
    content.heroWorkflowStages,
    parseLabelValueItems(homepageContentDefaults.heroWorkflowStages, []),
  ).map((stage, index) => ({ ...stage, icon: workflowIcons[index % workflowIcons.length] }));
  const modelOutputs = parseStringArray(content.heroOutputTags).length
    ? parseStringArray(content.heroOutputTags)
    : parseStringArray(homepageContentDefaults.heroOutputTags);
  const aboutScanTags = parseStringArray(content.aboutScanTags).length
    ? parseStringArray(content.aboutScanTags)
    : parseStringArray(homepageContentDefaults.aboutScanTags);
  const signalIcons = [BrainCircuit, Cpu, GitBranch, ShieldCheck];
  const candidateSignals = parseLabelValueItems(
    content.candidateSignals,
    parseLabelValueItems(homepageContentDefaults.candidateSignals, []),
  ).map((signal, index) => ({ ...signal, icon: signalIcons[index % signalIcons.length] }));
  const processIcons = [Target, Cpu, LineChart, Rocket];
  const processSteps = parseLabelValueItems(
    content.processSteps,
    parseLabelValueItems(homepageContentDefaults.processSteps, []),
  ).map((step, index) => ({ title: step.label, body: step.value, icon: processIcons[index % processIcons.length] }));
  const contactTiles = parseLabelValueItems(
    content.contactTiles,
    parseLabelValueItems(homepageContentDefaults.contactTiles, []),
  );
  const experienceTimeline = data.experience.length ? data.experience : fallbackExperienceTimeline;
  const educationTimeline = data.education.length ? data.education : fallbackEducationTimeline;
  const profileImageUrl = data.profile.profileImage?.url ?? null;
  const initials = getInitials(data.profile.displayName);
  const heroMetrics = [
    { value: content.heroMetricOneValue || data.profile.yearsLabel, label: content.heroMetricOneLabel || data.profile.yearsLabel },
    { value: content.heroMetricTwoValue || data.profile.projectsLabel, label: content.heroMetricTwoLabel || data.profile.projectsLabel },
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
                  {content.heroStatus}
                </span>
                <p className="mt-7 text-sm uppercase tracking-[0.28em] text-cyan-200">{data.hero.eyebrow}</p>
                <h1 className="mt-3 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-white md:text-7xl">
                  {data.hero.headline || data.profile.displayName}
                </h1>
                <p className="mt-5 text-xl font-semibold text-cyan-200">{data.profile.displayName} / {data.profile.role}</p>
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
                    {heroOrbitSignals.map((signal, index) => (
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
                            <small>{stage.value}</small>
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
                <p className="section-kicker">{content.aboutKicker}</p>
                <h2>{content.aboutHeading}</h2>
                <p>
                  {data.profile.about || 'LLM apps, ML systems, Python, RAG, evaluation, and MLOps.'}
                </p>
                <p>
                  {content.aboutBody}
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
                <p className="section-kicker">{content.skillsKicker}</p>
                <h2>{content.skillsHeading}</h2>
              </div>
              <p>{content.skillsSummary}</p>
            </div>
            <div className="capability-grid">
              {data.skillCategories.map((category) => {
                const averageProficiency = category.skills.length
                  ? category.skills.reduce((total, skill) => total + clampPercent(skill.proficiency), 0) / category.skills.length
                  : 70;

                return (
                <div key={category.id} className="skill-panel group">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-cyan-100">{category.name}</h3>
                    <Layers3 className="h-4 w-4 text-emerald-200 opacity-75 transition group-hover:opacity-100" />
                  </div>
                  <div className="mt-5 h-1.5 overflow-hidden rounded-lg bg-white/8">
                    <div
                      className="h-full rounded-lg bg-gradient-to-r from-cyan-300 to-emerald-300"
                      style={{ width: `${averageProficiency}%` }}
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span key={skill.id} className="tech-chip compact skill-token">
                        <span>{skill.name}</span>
                        <span className="skill-token-meter">
                          <i style={{ width: `${clampPercent(skill.proficiency)}%` }} />
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </SectionReveal>

        <SectionReveal id="featured-projects" className="portfolio-section">
          <div className="container-wide">
            <div className="section-heading-row">
              <div>
                <p className="section-kicker">{content.projectsKicker}</p>
                <h2>{content.projectsHeading}</h2>
              </div>
              <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-white">
                {content.projectsLinkLabel}
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
                <p className="section-kicker">{content.processKicker}</p>
                <h2>{content.processHeading}</h2>
              </div>
              <p>{content.processSummary}</p>
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
                <p className="section-kicker">{content.experienceKicker}</p>
                <h2>{content.experienceHeading}</h2>
              </div>
              <p>{content.experienceSummary}</p>
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
                <p className="section-kicker">{content.educationKicker}</p>
                <h2>{content.educationHeading}</h2>
              </div>
              <p>{content.educationSummary}</p>
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
              <p className="section-kicker">{content.achievementsKicker}</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">{content.achievementsHeading}</h2>
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
                <p className="section-kicker">{content.contactKicker}</p>
                <h2 className="mt-3 text-4xl font-semibold leading-tight text-white md:text-5xl">
                  {content.contactHeading}
                </h2>
                <p className="mt-4 max-w-xl text-slate-300">
                  {content.contactBody}
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {contactTiles.map((item) => (
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
            <p className="section-kicker">{content.finalCtaKicker}</p>
            <h2>{content.finalCtaHeading}</h2>
            <p>{content.finalCtaBody}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href={content.finalCtaPrimaryHref} className="action-primary">
                {content.finalCtaPrimaryLabel}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href={content.finalCtaSecondaryHref} className="action-secondary">
                {content.finalCtaSecondaryLabel}
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
