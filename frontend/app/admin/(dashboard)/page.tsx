import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth/session';
import AdminTable from '@/components/admin/AdminTable';
import VisibilityBadge from '@/components/admin/VisibilityBadge';
import { BarChart3, Inbox, Layers3, Star, Upload } from 'lucide-react';

function formatCount(value: number) {
    return new Intl.NumberFormat('en-US').format(value);
}

export default async function AdminDashboardPage() {
    const admin = await getCurrentAdmin();

    if (!admin) {
        redirect('/admin/login');
    }

    const [visibleProjects, featuredProjects, unreadSubmissions, resumeAsset] = await Promise.all([
        prisma.project.count({ where: { visible: true } }),
        prisma.project.count({ where: { visible: true, featured: true } }),
        prisma.contactSubmission.count({ where: { read: false, archived: false } }),
        prisma.resumeAsset.findUnique({
            where: { id: 1 },
            select: {
                mediaId: true,
                lastUpdatedDate: true,
                media: {
                    select: {
                        fileName: true,
                    },
                },
            },
        }),
    ]);

    const resumeReady = Boolean(resumeAsset?.mediaId);

    const overviewRows = [
        {
            label: 'Visible projects',
            value: formatCount(visibleProjects),
            note: 'Projects currently shown on the public site.',
        },
        {
            label: 'Featured projects',
            value: formatCount(featuredProjects),
            note: 'Visible projects marked as featured.',
        },
        {
            label: 'Open inbox items',
            value: formatCount(unreadSubmissions),
            note: 'Unread contact submissions that are not archived.',
        },
        {
            label: 'Resume upload',
            value: resumeReady ? 'Linked' : 'Missing',
            note: resumeReady
                ? resumeAsset?.media?.fileName
                    ? `Current file: ${resumeAsset.media.fileName}`
                    : 'Upload is connected to the active resume asset.'
                : 'Upload a resume file to make the download link work.',
        },
    ];

    return (
        <div className="space-y-8">
            <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                    Dashboard
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-white">
                    Admin control room
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-400">
                    A quick read on the portfolio public visibility, featured content, and the inbox state.
                </p>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard icon={Layers3} label="Visible projects" value={visibleProjects} tone="cyan" />
                <StatCard icon={Star} label="Featured projects" value={featuredProjects} tone="amber" />
                <StatCard icon={Inbox} label="Open inbox" value={unreadSubmissions} tone="rose" />
                <StatCard
                    icon={Upload}
                    label="Resume status"
                    value={resumeReady ? 'Uploaded' : 'Missing'}
                    tone={resumeReady ? 'emerald' : 'slate'}
                />
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
                <div className="rounded-lg border border-white/10 bg-slate-900/70 p-5 shadow-sm shadow-black/10">
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                                Content snapshot
                            </h2>
                            <p className="mt-1 text-sm text-slate-400">
                                Section-level counts tied to the public portfolio.
                            </p>
                        </div>
                        <BarChart3 className="h-5 w-5 text-cyan-300" />
                    </div>

                    <AdminTable
                        columns={[
                            { header: 'Area', className: 'w-[32%]' },
                            { header: 'Value', className: 'w-[18%]' },
                            { header: 'Notes' },
                        ]}
                        rows={overviewRows}
                        rowKey={(row) => row.label}
                        renderRow={(row) => (
                            <>
                                <td className="px-4 py-3 text-sm font-medium text-white">{row.label}</td>
                                <td className="px-4 py-3 text-sm text-slate-200">
                                    {row.label === 'Resume upload' ? (
                                        <VisibilityBadge
                                            visible={resumeReady}
                                            visibleLabel="Uploaded"
                                            hiddenLabel="Missing"
                                        />
                                    ) : (
                                        row.value
                                    )}
                                </td>
                                <td className="px-4 py-3 text-sm leading-6 text-slate-400">{row.note}</td>
                            </>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <div className="rounded-lg border border-white/10 bg-slate-900/70 p-5 shadow-sm shadow-black/10">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                                    Resume status
                                </h2>
                                <p className="mt-1 text-sm text-slate-400">
                                    Quick check for the active resume asset.
                                </p>
                            </div>
                            <VisibilityBadge
                                visible={resumeReady}
                                visibleLabel="Ready"
                                hiddenLabel="Missing"
                            />
                        </div>
                        <dl className="mt-5 space-y-4 text-sm">
                            <div className="flex items-start justify-between gap-4 border-t border-white/5 pt-4">
                                <dt className="text-slate-400">File</dt>
                                <dd className="text-right text-slate-100">
                                    {resumeAsset?.media?.fileName ?? 'No file linked'}
                                </dd>
                            </div>
                            <div className="flex items-start justify-between gap-4 border-t border-white/5 pt-4">
                                <dt className="text-slate-400">Updated</dt>
                                <dd className="text-right text-slate-100">
                                    {resumeAsset?.lastUpdatedDate ?? 'Not set'}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-slate-900/70 p-5 shadow-sm shadow-black/10">
                        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                            Owner notes
                        </h2>
                        <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-400">
                            <li>Featured content stays a subset of visible projects.</li>
                            <li>Inbox counts exclude archived conversations.</li>
                            <li>Resume upload status should stay linked to the current file before publishing updates.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}

interface StatCardProps {
    icon: typeof Layers3;
    label: string;
    value: number | string;
    tone: 'cyan' | 'amber' | 'rose' | 'emerald' | 'slate';
}

function StatCard({ icon: Icon, label, value, tone }: StatCardProps) {
    const toneStyles: Record<StatCardProps['tone'], string> = {
        cyan: 'border-cyan-400/15 bg-cyan-400/8 text-cyan-200',
        amber: 'border-amber-400/15 bg-amber-400/8 text-amber-200',
        rose: 'border-rose-400/15 bg-rose-400/8 text-rose-200',
        emerald: 'border-emerald-400/15 bg-emerald-400/8 text-emerald-200',
        slate: 'border-slate-500/15 bg-slate-500/8 text-slate-200',
    };

    return (
        <div className="rounded-lg border border-white/10 bg-slate-900/70 p-4 shadow-sm shadow-black/10">
            <div className={`inline-flex items-center justify-center rounded-lg border p-2 ${toneStyles[tone]}`}>
                <Icon className="h-4 w-4" />
            </div>
            <p className="mt-4 text-sm text-slate-400">{label}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-white">{value}</p>
        </div>
    );
}
