import { Archive, CheckCircle2, MailOpen, RotateCcw } from 'lucide-react';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';
import { requiredId, revalidateAdminPaths } from '@/lib/admin/forms';

function formatDate(date: Date) {
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
}

async function markRead(formData: FormData) {
    'use server';

    await requireAdmin();
    await prisma.contactSubmission.update({
        where: { id: requiredId(formData) },
        data: { read: true },
    });
    revalidateAdminPaths('/admin/contact-submissions', ['/admin']);
}

async function markUnread(formData: FormData) {
    'use server';

    await requireAdmin();
    await prisma.contactSubmission.update({
        where: { id: requiredId(formData) },
        data: { read: false },
    });
    revalidateAdminPaths('/admin/contact-submissions', ['/admin']);
}

async function archiveSubmission(formData: FormData) {
    'use server';

    await requireAdmin();
    await prisma.contactSubmission.update({
        where: { id: requiredId(formData) },
        data: { archived: true },
    });
    revalidateAdminPaths('/admin/contact-submissions', ['/admin']);
}

async function restoreSubmission(formData: FormData) {
    'use server';

    await requireAdmin();
    await prisma.contactSubmission.update({
        where: { id: requiredId(formData) },
        data: { archived: false },
    });
    revalidateAdminPaths('/admin/contact-submissions', ['/admin']);
}

export default async function ContactSubmissionsPage() {
    await requireAdmin();

    const [activeSubmissions, archivedSubmissions] = await Promise.all([
        prisma.contactSubmission.findMany({
            where: { archived: false },
            orderBy: [{ read: 'asc' }, { createdAt: 'desc' }],
        }),
        prisma.contactSubmission.findMany({
            where: { archived: true },
            orderBy: { createdAt: 'desc' },
            take: 25,
        }),
    ]);

    const unreadCount = activeSubmissions.filter((submission) => !submission.read).length;

    return (
        <div className="space-y-8">
            <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                    Contact inbox
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-white">Review visitor messages</h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-400">
                    Messages from the public contact form stay here for review. Archive only when you are done
                    with a conversation.
                </p>
            </section>

            <section className="grid gap-4 sm:grid-cols-3">
                <Metric label="Active messages" value={activeSubmissions.length} />
                <Metric label="Unread" value={unreadCount} />
                <Metric label="Archived" value={archivedSubmissions.length} />
            </section>

            <section className="space-y-5">
                <div>
                    <h2 className="text-xl font-semibold text-white">Inbox</h2>
                    <p className="mt-1 text-sm text-slate-400">
                        Keep unread messages open until you have replied or copied the contact details.
                    </p>
                </div>

                {activeSubmissions.length ? (
                    <div className="space-y-4">
                        {activeSubmissions.map((submission) => (
                            <SubmissionCard
                                key={submission.id}
                                submission={submission}
                                primaryAction={submission.read ? markUnread : markRead}
                                primaryLabel={submission.read ? 'Mark unread' : 'Mark read'}
                                primaryIcon={submission.read ? MailOpen : CheckCircle2}
                                secondaryAction={archiveSubmission}
                                secondaryLabel="Archive"
                                secondaryIcon={Archive}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState message="No active contact submissions yet." />
                )}
            </section>

            <section className="space-y-5">
                <div>
                    <h2 className="text-xl font-semibold text-white">Archived</h2>
                    <p className="mt-1 text-sm text-slate-400">
                        Recent archived messages are kept for reference and can be restored.
                    </p>
                </div>

                {archivedSubmissions.length ? (
                    <div className="space-y-4">
                        {archivedSubmissions.map((submission) => (
                            <SubmissionCard
                                key={submission.id}
                                submission={submission}
                                primaryAction={restoreSubmission}
                                primaryLabel="Restore"
                                primaryIcon={RotateCcw}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState message="No archived submissions." />
                )}
            </section>
        </div>
    );
}

interface MetricProps {
    label: string;
    value: number;
}

function Metric({ label, value }: MetricProps) {
    return (
        <div className="rounded-lg border border-white/10 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}</p>
        </div>
    );
}

interface SubmissionCardProps {
    submission: {
        id: number;
        name: string;
        email: string;
        message: string;
        read: boolean;
        createdAt: Date;
    };
    primaryAction: (formData: FormData) => Promise<void>;
    primaryLabel: string;
    primaryIcon: typeof CheckCircle2;
    secondaryAction?: (formData: FormData) => Promise<void>;
    secondaryLabel?: string;
    secondaryIcon?: typeof Archive;
}

function SubmissionCard({
    submission,
    primaryAction,
    primaryLabel,
    primaryIcon: PrimaryIcon,
    secondaryAction,
    secondaryLabel,
    secondaryIcon: SecondaryIcon,
}: SubmissionCardProps) {
    return (
        <article className="rounded-lg border border-white/10 bg-slate-900/70 p-5 shadow-sm shadow-black/10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold text-white">{submission.name}</h3>
                        <span
                            className={[
                                'rounded-lg border px-2.5 py-1 text-xs font-semibold',
                                submission.read
                                    ? 'border-emerald-300/20 bg-emerald-300/10 text-emerald-100'
                                    : 'border-cyan-300/20 bg-cyan-300/10 text-cyan-100',
                            ].join(' ')}
                        >
                            {submission.read ? 'Read' : 'Unread'}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-400">
                        <a className="text-cyan-200 hover:text-cyan-100" href={`mailto:${submission.email}`}>
                            {submission.email}
                        </a>
                        <span>{formatDate(submission.createdAt)}</span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">{submission.message}</p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                    <form action={primaryAction}>
                        <input type="hidden" name="id" value={submission.id} />
                        <button className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-white/5">
                            <PrimaryIcon className="h-4 w-4" />
                            {primaryLabel}
                        </button>
                    </form>
                    {secondaryAction && secondaryLabel && SecondaryIcon ? (
                        <form action={secondaryAction}>
                            <input type="hidden" name="id" value={submission.id} />
                            <button className="inline-flex items-center gap-2 rounded-lg border border-amber-300/30 px-3 py-2 text-sm font-semibold text-amber-100 hover:bg-amber-300/10">
                                <SecondaryIcon className="h-4 w-4" />
                                {secondaryLabel}
                            </button>
                        </form>
                    ) : null}
                </div>
            </div>
        </article>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <p className="rounded-lg border border-white/10 bg-slate-900/70 p-5 text-sm text-slate-400">
            {message}
        </p>
    );
}
