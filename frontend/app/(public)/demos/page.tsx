import Link from 'next/link';
import { prisma } from '@/lib/db';
import { hasDatabaseUrl } from '@/lib/env';
import PublicNav from '@/components/public/PublicNav';
import SectionReveal from '@/components/public/SectionReveal';

export const dynamic = 'force-dynamic';

type DemoPageState = {
    demos: Array<{
        id: number;
        title: string;
        description: string;
        domain: string;
        status: string;
        externalUrl: string | null;
        embedConfig: string | null;
    }>;
    loadingIssue: boolean;
};

function formatStatusLabel(status: string) {
    return status.replaceAll('_', ' ').toLowerCase();
}

async function loadDemosPageData(): Promise<DemoPageState> {
    if (!hasDatabaseUrl()) {
        return {
            demos: [],
            loadingIssue: true,
        };
    }

    try {
        const demos = await prisma.demo.findMany({
            where: {
                visible: true,
                status: {
                    in: ['CASE_STUDY_ONLY', 'EXTERNAL_DEMO', 'EMBEDDED_DEMO'],
                },
            },
            orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
        });

        return {
            demos,
            loadingIssue: false,
        };
    } catch {
        return {
            demos: [],
            loadingIssue: true,
        };
    }
}

export default async function DemosPage() {
    const { demos, loadingIssue } = await loadDemosPageData();
    const hasDemos = demos.length > 0;

    return (
        <div className="cinematic-shell">
            <PublicNav />
            <main className="space-y-12 pb-16">
                <SectionReveal className="container-wide py-14 md:py-16">
                    <div className="max-w-3xl">
                        <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Demos</p>
                        <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
                            Live demos appear here once they are enabled and ready.
                        </h1>
                        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                            This page only surfaces public demo records that have been marked visible and published
                            from the CMS.
                        </p>
                    </div>
                </SectionReveal>

                <SectionReveal className="container-wide">
                    {hasDemos ? (
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {demos.map((demo) => (
                                <article
                                    key={demo.id}
                                    className="glass-panel flex h-full flex-col rounded-lg p-5 transition hover:border-cyan-200/35"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">
                                            {demo.domain}
                                        </p>
                                        <span className="rounded-md border border-cyan-200/20 px-2 py-1 text-xs capitalize text-slate-300">
                                            {formatStatusLabel(demo.status)}
                                        </span>
                                    </div>
                                    <h2 className="mt-4 text-xl font-semibold text-white">{demo.title}</h2>
                                    <p className="mt-3 flex-1 text-sm leading-6 text-slate-300">
                                        {demo.description}
                                    </p>
                                    <div className="mt-5 flex flex-wrap gap-3 text-sm">
                                        {demo.externalUrl ? (
                                            <Link
                                                href={demo.externalUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-cyan-200 transition hover:text-white"
                                            >
                                                Open demo
                                            </Link>
                                        ) : null}
                                        {demo.status === 'CASE_STUDY_ONLY' ? (
                                            <span className="text-slate-400">Case study only</span>
                                        ) : null}
                                        {demo.status === 'EMBEDDED_DEMO' ? (
                                            <span className="text-slate-400">Embedded delivery ready</span>
                                        ) : null}
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-panel rounded-lg p-6 md:p-8">
                            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">
                                {loadingIssue ? 'Demo data unavailable' : 'No public demos yet'}
                            </p>
                            <h2 className="mt-3 text-2xl font-semibold text-white">
                                {loadingIssue
                                    ? 'The demo feed could not be loaded right now.'
                                    : 'Nothing has been published for public demo viewing.'}
                            </h2>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                                {loadingIssue
                                    ? 'The route is still available, but the database lookup or local backend connection is down.'
                                    : 'When a demo is marked visible and set to a ready status, it will appear here with its real link or case-study state.'}
                            </p>
                            <div className="mt-6">
                                <Link
                                    href="/projects"
                                    className="rounded-md border border-cyan-200/20 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-200/50 hover:text-white"
                                >
                                    Browse projects
                                </Link>
                            </div>
                        </div>
                    )}
                </SectionReveal>
            </main>
        </div>
    );
}
