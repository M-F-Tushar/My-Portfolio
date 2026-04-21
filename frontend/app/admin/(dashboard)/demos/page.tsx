import { DemoStatus } from '@prisma/client';
import FormField from '@/components/admin/FormField';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';
import {
    checkboxValue,
    enumValue,
    intWithDefault,
    optionalString,
    requiredId,
    requiredString,
    revalidateAdminPaths,
} from '@/lib/admin/forms';

const demoStatuses = [
    DemoStatus.HIDDEN,
    DemoStatus.COMING_SOON,
    DemoStatus.CASE_STUDY_ONLY,
    DemoStatus.EXTERNAL_DEMO,
    DemoStatus.EMBEDDED_DEMO,
] as const;

const selectClassName =
    'mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15';

function readDemoData(formData: FormData) {
    return {
        title: requiredString(formData, 'title', 'Title'),
        description: requiredString(formData, 'description', 'Description'),
        domain: requiredString(formData, 'domain', 'Domain'),
        status: enumValue(formData, 'status', demoStatuses, DemoStatus.HIDDEN),
        externalUrl: optionalString(formData, 'externalUrl'),
        embedConfig: optionalString(formData, 'embedConfig'),
        visible: checkboxValue(formData, 'visible'),
        sortOrder: intWithDefault(formData, 'sortOrder'),
    };
}

async function createDemo(formData: FormData) {
    'use server';

    await requireAdmin();
    await prisma.demo.create({ data: readDemoData(formData) });
    revalidateAdminPaths('/admin/demos', ['/', '/demos']);
}

async function updateDemo(formData: FormData) {
    'use server';

    await requireAdmin();
    await prisma.demo.update({ where: { id: requiredId(formData) }, data: readDemoData(formData) });
    revalidateAdminPaths('/admin/demos', ['/', '/demos']);
}

async function deleteDemo(formData: FormData) {
    'use server';

    await requireAdmin();
    await prisma.demo.delete({ where: { id: requiredId(formData) } });
    revalidateAdminPaths('/admin/demos', ['/', '/demos']);
}

export default async function AdminDemosPage() {
    const demos = await prisma.demo.findMany({
        orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
    });

    return (
        <div className="space-y-8">
            <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Demos</p>
                <h1 className="text-3xl font-semibold tracking-tight text-white">Manage demos</h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-400">
                    Add demo records and choose when they are visible to visitors.
                </p>
            </section>

            <DemoForm action={createDemo} submitLabel="Create demo" />

            <section className="space-y-5">
                <h2 className="text-xl font-semibold text-white">Current demos</h2>
                {demos.length ? demos.map((demo) => (
                    <div key={demo.id} className="space-y-4 rounded-lg border border-white/10 bg-slate-900/70 p-5">
                        <DemoForm
                            action={updateDemo}
                            submitLabel="Save demo"
                            values={{
                                id: demo.id,
                                title: demo.title,
                                description: demo.description,
                                domain: demo.domain,
                                status: demo.status,
                                externalUrl: demo.externalUrl ?? '',
                                embedConfig: demo.embedConfig ?? '',
                                visible: demo.visible,
                                sortOrder: demo.sortOrder,
                            }}
                        />
                        <form action={deleteDemo}>
                            <input type="hidden" name="id" value={demo.id} />
                            <button className="rounded-lg border border-rose-300/40 px-4 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-400/10">
                                Delete
                            </button>
                        </form>
                    </div>
                )) : (
                    <p className="rounded-lg border border-white/10 bg-slate-900/70 p-5 text-sm text-slate-400">
                        No demos yet.
                    </p>
                )}
            </section>
        </div>
    );
}

type DemoFormValues = {
    id?: number;
    title?: string;
    description?: string;
    domain?: string;
    status?: DemoStatus;
    externalUrl?: string;
    embedConfig?: string;
    visible?: boolean;
    sortOrder?: number;
};

function DemoForm({
    action,
    submitLabel,
    values = {},
}: {
    action: (formData: FormData) => Promise<void>;
    submitLabel: string;
    values?: DemoFormValues;
}) {
    return (
        <form action={action} className="space-y-5 rounded-lg border border-white/10 bg-slate-900/70 p-5">
            {values.id ? <input type="hidden" name="id" value={values.id} /> : null}
            <div className="grid gap-5 md:grid-cols-2">
                <FormField label="Title" name="title" required defaultValue={values.title} />
                <FormField label="Domain" name="domain" required defaultValue={values.domain} />
                <FormField label="External URL" name="externalUrl" type="url" defaultValue={values.externalUrl} />
                <FormField label="Sort order" name="sortOrder" type="number" defaultValue={values.sortOrder ?? 0} />
            </div>
            <FormField label="Description" name="description" required textarea rows={4} defaultValue={values.description} />
            <FormField
                label="Embed config"
                name="embedConfig"
                hint="Optional JSON or notes for embedded delivery."
                textarea
                rows={4}
                defaultValue={values.embedConfig}
            />
            <label className="block text-sm font-medium text-slate-200">
                Status
                <select name="status" defaultValue={values.status ?? DemoStatus.HIDDEN} className={selectClassName}>
                    {demoStatuses.map((status) => (
                        <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>
                    ))}
                </select>
            </label>
            <CheckboxField name="visible" label="Visible on site" defaultChecked={values.visible ?? false} />
            <button className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200">
                {submitLabel}
            </button>
        </form>
    );
}

function CheckboxField({ name, label, defaultChecked = false }: { name: string; label: string; defaultChecked?: boolean }) {
    return (
        <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-200">
            <input
                type="checkbox"
                name={name}
                defaultChecked={defaultChecked}
                className="h-4 w-4 rounded border-white/20 bg-slate-950 text-cyan-300"
            />
            {label}
        </label>
    );
}
