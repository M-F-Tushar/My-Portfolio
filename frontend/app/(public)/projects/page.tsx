import Link from 'next/link';
import { prisma } from '@/lib/db';
import { homepageContentDefaults } from '@/lib/content/homepage';
import { hasDatabaseUrl } from '@/lib/env';
import PublicNav from '@/components/public/PublicNav';
import SectionReveal from '@/components/public/SectionReveal';
import ProjectCard, { type ProjectCardProject } from '@/components/public/ProjectCard';

export const dynamic = 'force-dynamic';

type PublicProject = ProjectCardProject & { slug: string };

type ProjectsPageState = {
    projects: PublicProject[];
    content: Pick<typeof homepageContentDefaults, 'projectsPageKicker' | 'projectsPageHeading' | 'projectsPageSummary'>;
    loadingIssue: boolean;
};

const fallbackProjects: PublicProject[] = [
    {
        slug: 'ai-portfolio-platform',
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
        slug: 'ml-learning-lab',
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

async function loadProjectsPageData(): Promise<ProjectsPageState> {
    if (!hasDatabaseUrl()) {
        return {
            projects: fallbackProjects,
            content: homepageContentDefaults,
            loadingIssue: false,
        };
    }

    try {
        const [projects, content] = await Promise.all([
            prisma.project.findMany({
                where: { visible: true },
                include: { image: true },
                orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
            }),
            prisma.homepageContent.findUnique({
                where: { id: 1 },
                select: {
                    projectsPageKicker: true,
                    projectsPageHeading: true,
                    projectsPageSummary: true,
                },
            }),
        ]);

        return {
            projects,
            content: content ?? homepageContentDefaults,
            loadingIssue: false,
        };
    } catch {
        return {
            projects: [],
            content: homepageContentDefaults,
            loadingIssue: true,
        };
    }
}

export default async function ProjectsPage() {
    const { projects, content, loadingIssue } = await loadProjectsPageData();

    const hasProjects = projects.length > 0;

    return (
        <div className="cinematic-shell">
            <PublicNav />
            <main className="space-y-12 pb-16">
                <SectionReveal className="container-wide py-14 md:py-16">
                    <div className="max-w-3xl">
                        <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">{content.projectsPageKicker}</p>
                        <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
                            {content.projectsPageHeading}
                        </h1>
                        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                            {content.projectsPageSummary}
                        </p>
                    </div>
                </SectionReveal>

                <SectionReveal className="container-wide">
                    {hasProjects ? (
                        <div className="space-y-5">
                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {projects.map((project) => (
                                    <ProjectCard key={project.slug} project={project} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="glass-panel rounded-lg p-6 md:p-8">
                            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">
                                {loadingIssue ? 'Project data unavailable' : 'No public projects yet'}
                            </p>
                            <h2 className="mt-3 text-2xl font-semibold text-white">
                                {loadingIssue
                                    ? 'The project feed could not be loaded right now.'
                                    : 'Nothing is published for the public portfolio yet.'}
                            </h2>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                                {loadingIssue
                                    ? 'The database may be offline locally or the project records may be temporarily unavailable. Try again once the CMS connection is restored.'
                                    : 'Visible projects will appear here as soon as they are published from the admin side.'}
                            </p>
                            <div className="mt-6">
                                <Link
                                    href="/#contact"
                                    className="rounded-md border border-cyan-200/20 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-200/50 hover:text-white"
                                >
                                    Get in touch
                                </Link>
                            </div>
                        </div>
                    )}
                </SectionReveal>
            </main>
        </div>
    );
}
