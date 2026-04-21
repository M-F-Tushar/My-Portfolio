import Link from 'next/link';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';
import { parseStringArray, stringifyStringArray } from '@/lib/content/json';
import { revalidateAdminPaths, optionalString } from '@/lib/admin/forms';
import FormField from '@/components/admin/FormField';
import ResumePdfUpload from '@/components/admin/ResumePdfUpload';
import { formatMediaFileSize, type UploadedMediaAsset } from '@/lib/media/upload';

function toLineArray(value: string) {
    return value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
}

async function saveResumeAsset(formData: FormData) {
    'use server';

    await requireAdmin();

    const mediaIdValue = optionalString(formData, 'mediaId');
    const parsedMediaId = mediaIdValue === null
        ? null
        : (() => {
            const value = Number(mediaIdValue);

            if (!Number.isInteger(value) || value <= 0) {
                throw new Error('Media id must be a whole number.');
            }

            return value;
        })();

    const highlights = stringifyStringArray(toLineArray(optionalString(formData, 'highlights') ?? ''));
    const lastUpdatedDate = optionalString(formData, 'lastUpdatedDate');

    await prisma.resumeAsset.upsert({
        where: { id: 1 },
        update: {
            mediaId: parsedMediaId,
            highlights,
            lastUpdatedDate,
        },
        create: {
            id: 1,
            mediaId: parsedMediaId,
            highlights,
            lastUpdatedDate,
        },
    });

    revalidateAdminPaths('/admin/resume', ['/', '/resume']);
}

function formatResumeMeta(media: UploadedMediaAsset | null, lastUpdatedDate: string | null) {
    const rows = [
        { label: 'File', value: media?.fileName ?? 'No file linked' },
        { label: 'Type', value: media?.mimeType ?? 'Not set' },
        { label: 'Size', value: formatMediaFileSize(media?.fileSize ?? null) ?? 'Not set' },
        { label: 'Updated', value: lastUpdatedDate ?? 'Not set' },
    ];

    return rows;
}

export default async function AdminResumePage() {
    await requireAdmin();

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
                mediaId: true,
                highlights: true,
                lastUpdatedDate: true,
                media: {
                    select: {
                        id: true,
                        url: true,
                        key: true,
                        fileName: true,
                        mimeType: true,
                        fileSize: true,
                    },
                },
            },
        }),
    ]);

    const media = resumeAsset?.media ?? null;
    const highlights = parseStringArray(resumeAsset?.highlights);
    const isPdf = media?.mimeType === 'application/pdf' || (media?.url?.toLowerCase().endsWith('.pdf') ?? false);
    const currentMedia = media as UploadedMediaAsset | null;

    return (
        <div className="space-y-8">
            <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Resume</p>
                <h1 className="text-3xl font-semibold tracking-tight text-white">Manage the resume asset</h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-400">
                    Update the active PDF, keep the published highlights in sync, and control the last updated date shown on the public resume page.
                </p>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
                <div className="space-y-4 rounded-lg border border-white/10 bg-slate-900/70 p-5 shadow-sm shadow-black/10">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                Current PDF
                            </p>
                            <h2 className="mt-2 text-xl font-semibold text-white">
                                {media?.fileName ?? 'No resume file linked'}
                            </h2>
                            <p className="mt-1 text-sm text-slate-400">
                                {profile?.displayName ?? 'Resume'}{profile?.role ? ` • ${profile.role}` : ''}
                            </p>
                        </div>
                        <div className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-200">
                            {media ? 'Linked' : 'Missing'}
                        </div>
                    </div>

                    <dl className="grid gap-3 text-sm sm:grid-cols-2">
                        {formatResumeMeta(currentMedia, resumeAsset?.lastUpdatedDate ?? null).map((row) => (
                            <div key={row.label} className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
                                <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">{row.label}</dt>
                                <dd className="mt-1 text-sm text-slate-100">{row.value}</dd>
                            </div>
                        ))}
                    </dl>

                    <div className="flex flex-wrap gap-3">
                        {media?.url ? (
                            <>
                                <Link
                                    href={media.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                                >
                                    Open PDF
                                </Link>
                                <Link
                                    href={media.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    download={media.fileName}
                                    className="inline-flex items-center rounded-lg border border-cyan-300/20 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/10"
                                >
                                    Download PDF
                                </Link>
                            </>
                        ) : null}
                    </div>

                    <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-950">
                        {isPdf && media?.url ? (
                            <iframe
                                title="Current resume preview"
                                src={media.url}
                                className="min-h-[34rem] w-full border-0 bg-slate-950"
                            />
                        ) : (
                            <div className="flex min-h-[34rem] items-center justify-center p-8 text-center">
                                <div className="max-w-md">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                        Preview unavailable
                                    </p>
                                    <p className="mt-3 text-sm leading-6 text-slate-300">
                                        Upload a PDF to render the inline preview here.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <form action={saveResumeAsset} className="space-y-5 rounded-lg border border-white/10 bg-slate-900/70 p-5 shadow-sm shadow-black/10">
                    <ResumePdfUpload initialMedia={currentMedia} />
                    <FormField
                        label="Highlights"
                        name="highlights"
                        textarea
                        rows={8}
                        hint="Enter one highlight per line. These become the public resume tags."
                        defaultValue={highlights.join('\n')}
                    />
                    <FormField
                        label="Last updated date"
                        name="lastUpdatedDate"
                        hint="Use the date format you want visitors to see, such as Apr 21, 2026."
                        defaultValue={resumeAsset?.lastUpdatedDate ?? ''}
                    />
                    <div className="flex justify-end">
                        <button className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">
                            Save resume
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
