import Link from 'next/link';
import { prisma } from '@/lib/db';
import { parseStringArray } from '@/lib/content/json';
import { hasDatabaseUrl } from '@/lib/env';
import PublicNav from '@/components/public/PublicNav';
import SectionReveal from '@/components/public/SectionReveal';

export const dynamic = 'force-dynamic';

type ResumePageState = {
    displayName: string;
    role: string;
    summary: string;
    resumeUrl: string | null;
    fileName: string | null;
    mimeType: string | null;
    fileSize: number | null;
    lastUpdatedDate: string | null;
    highlights: string[];
    loadingIssue: boolean;
};

function formatFileSize(bytes: number | null) {
    if (bytes === null || Number.isNaN(bytes)) {
        return null;
    }

    if (bytes < 1024) {
        return `${bytes} B`;
    }

    const units = ['KB', 'MB', 'GB'];
    let value = bytes / 1024;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex += 1;
    }

    return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

async function loadResumePageData(): Promise<ResumePageState> {
    if (!hasDatabaseUrl()) {
        return {
            displayName: 'Portfolio resume',
            role: 'Professional summary',
            summary: 'Upload a direct PDF from the admin panel when the resume is ready.',
            resumeUrl: null,
            fileName: null,
            mimeType: null,
            fileSize: null,
            lastUpdatedDate: null,
            highlights: [],
            loadingIssue: false,
        };
    }

    try {
        const [profile, resumeAsset] = await Promise.all([
            prisma.profile.findUnique({
                where: { id: 1 },
                select: {
                    displayName: true,
                    role: true,
                    shortBio: true,
                },
            }),
            prisma.resumeAsset.findUnique({
                where: { id: 1 },
                select: {
                    lastUpdatedDate: true,
                    highlights: true,
                    media: {
                        select: {
                            url: true,
                            fileName: true,
                            mimeType: true,
                            fileSize: true,
                        },
                    },
                },
            }),
        ]);

        const highlights = parseStringArray(resumeAsset?.highlights);
        const media = resumeAsset?.media ?? null;

        return {
            displayName: profile?.displayName ?? 'Portfolio resume',
            role: profile?.role ?? 'Professional summary',
            summary:
                profile?.shortBio ??
                'A concise visitor-facing resume page with a direct PDF preview when the file is uploaded.',
            resumeUrl: media?.url ?? null,
            fileName: media?.fileName ?? null,
            mimeType: media?.mimeType ?? null,
            fileSize: media?.fileSize ?? null,
            lastUpdatedDate: resumeAsset?.lastUpdatedDate ?? null,
            highlights,
            loadingIssue: false,
        };
    } catch {
        return {
            displayName: 'Portfolio resume',
            role: 'Professional summary',
            summary: 'The resume asset could not be loaded right now.',
            resumeUrl: null,
            fileName: null,
            mimeType: null,
            fileSize: null,
            lastUpdatedDate: null,
            highlights: [],
            loadingIssue: true,
        };
    }
}

export default async function ResumePage() {
    const data = await loadResumePageData();
    const resumeUrl = data.resumeUrl;
    const resumeReady = Boolean(resumeUrl);
    const isPdf = data.mimeType === 'application/pdf' || (resumeUrl?.toLowerCase().endsWith('.pdf') ?? false);
    const fileSize = formatFileSize(data.fileSize);

    return (
        <div className="cinematic-shell">
            <PublicNav />
            <main className="space-y-12 pb-16">
                <SectionReveal className="container-wide py-14 md:py-16">
                    <div className="max-w-3xl">
                        <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Resume</p>
                        <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
                            {data.displayName}
                        </h1>
                        <p className="mt-4 text-lg leading-8 text-slate-300">{data.summary}</p>
                        <p className="mt-3 text-sm uppercase tracking-[0.22em] text-emerald-200">{data.role}</p>
                    </div>
                </SectionReveal>

                <SectionReveal className="container-wide">
                    {resumeReady && resumeUrl ? (
                        <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
                            <div className="space-y-6">
                                <div className="glass-panel rounded-lg p-6">
                                    <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">
                                        Current file
                                    </p>
                                    <h2 className="mt-3 text-2xl font-semibold text-white">
                                        {data.fileName ?? 'Resume PDF'}
                                    </h2>
                                    <dl className="mt-5 space-y-3 text-sm text-slate-300">
                                        {data.lastUpdatedDate ? (
                                            <div className="flex items-start justify-between gap-4 border-t border-white/5 pt-3">
                                                <dt className="text-slate-400">Last updated</dt>
                                                <dd className="text-right text-slate-100">{data.lastUpdatedDate}</dd>
                                            </div>
                                        ) : null}
                                        {fileSize ? (
                                            <div className="flex items-start justify-between gap-4 border-t border-white/5 pt-3">
                                                <dt className="text-slate-400">Size</dt>
                                                <dd className="text-right text-slate-100">{fileSize}</dd>
                                            </div>
                                        ) : null}
                                        {data.mimeType ? (
                                            <div className="flex items-start justify-between gap-4 border-t border-white/5 pt-3">
                                                <dt className="text-slate-400">Format</dt>
                                                <dd className="text-right text-slate-100">{data.mimeType}</dd>
                                            </div>
                                        ) : null}
                                    </dl>

                                    <div className="mt-6 flex flex-wrap gap-3">
                                        <Link
                                            href={resumeUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-md bg-cyan-300 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-200"
                                        >
                                            Open PDF
                                        </Link>
                                        <Link
                                            href={resumeUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            download={data.fileName ?? undefined}
                                            className="rounded-md border border-cyan-200/20 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-200/50 hover:text-white"
                                        >
                                            Download PDF
                                        </Link>
                                    </div>
                                </div>

                                {data.highlights.length > 0 ? (
                                    <div className="glass-panel rounded-lg p-6">
                                        <p className="text-sm uppercase tracking-[0.24em] text-emerald-200">
                                            Highlights
                                        </p>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {data.highlights.map((highlight) => (
                                                <span
                                                    key={highlight}
                                                    className="rounded-md border border-white/10 px-3 py-1 text-sm text-slate-200"
                                                >
                                                    {highlight}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                            </div>

                            <div className="glass-panel overflow-hidden rounded-lg">
                                {isPdf ? (
                                    <iframe
                                        title="Resume PDF preview"
                                        src={resumeUrl}
                                        className="min-h-[78vh] w-full border-0 bg-slate-950"
                                    />
                                ) : (
                                    <div className="flex min-h-[78vh] items-center justify-center p-8">
                                        <div className="max-w-xl">
                                            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">
                                                Preview unavailable
                                            </p>
                                            <h2 className="mt-3 text-2xl font-semibold text-white">
                                                The uploaded resume is not a PDF.
                                            </h2>
                                            <p className="mt-3 text-sm leading-7 text-slate-300">
                                                The direct file link is still available on the left. If you want the
                                                in-page preview, upload a PDF version of the resume asset.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="glass-panel rounded-lg p-6 md:p-8">
                            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">
                                {data.loadingIssue ? 'Resume data unavailable' : 'Resume missing'}
                            </p>
                            <h2 className="mt-3 text-2xl font-semibold text-white">
                                {data.loadingIssue
                                    ? 'The resume asset could not be loaded right now.'
                                    : 'No resume PDF has been uploaded yet.'}
                            </h2>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                                {data.loadingIssue
                                    ? 'The visitor resume page is intact, but the database or asset lookup is unavailable locally.'
                                    : 'Once a PDF is attached to the active resume asset, visitors will be able to preview it here and download the direct file.'}
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link
                                    href="/projects"
                                    className="rounded-md bg-cyan-300 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-200"
                                >
                                    View projects
                                </Link>
                                <Link
                                    href="/#contact"
                                    className="rounded-md border border-cyan-200/20 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-200/50 hover:text-white"
                                >
                                    Contact
                                </Link>
                            </div>
                        </div>
                    )}
                </SectionReveal>
            </main>
        </div>
    );
}
