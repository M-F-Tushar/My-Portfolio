import FormField from '@/components/admin/FormField';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';
import {
    checkboxValue,
    intWithDefault,
    optionalString,
    requiredId,
    requiredString,
    revalidateAdminPaths,
} from '@/lib/admin/forms';

function readCertificationData(formData: FormData) {
    return {
        name: requiredString(formData, 'name', 'Name'),
        issuer: optionalString(formData, 'issuer'),
        date: optionalString(formData, 'date'),
        credentialUrl: optionalString(formData, 'credentialUrl'),
        visible: checkboxValue(formData, 'visible'),
        sortOrder: intWithDefault(formData, 'sortOrder'),
    };
}

async function createCertification(formData: FormData) {
    'use server';

    await requireAdmin();
    await prisma.certification.create({ data: readCertificationData(formData) });
    revalidateAdminPaths('/admin/certifications', ['/']);
}

async function updateCertification(formData: FormData) {
    'use server';

    await requireAdmin();
    await prisma.certification.update({ where: { id: requiredId(formData) }, data: readCertificationData(formData) });
    revalidateAdminPaths('/admin/certifications', ['/']);
}

async function deleteCertification(formData: FormData) {
    'use server';

    await requireAdmin();
    await prisma.certification.delete({ where: { id: requiredId(formData) } });
    revalidateAdminPaths('/admin/certifications', ['/']);
}

export default async function AdminCertificationsPage() {
    const certifications = await prisma.certification.findMany({
        orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
    });

    return (
        <div className="space-y-8">
            <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Certifications</p>
                <h1 className="text-3xl font-semibold tracking-tight text-white">Manage certifications</h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-400">
                    Add course certificates, issuer names, dates, and credential links.
                </p>
            </section>

            <CertificationForm action={createCertification} submitLabel="Create certification" />

            <section className="space-y-5">
                <h2 className="text-xl font-semibold text-white">Current certifications</h2>
                {certifications.length ? certifications.map((item) => (
                    <div key={item.id} className="space-y-4 rounded-lg border border-white/10 bg-slate-900/70 p-5">
                        <CertificationForm
                            action={updateCertification}
                            submitLabel="Save certification"
                            values={{
                                id: item.id,
                                name: item.name,
                                issuer: item.issuer ?? '',
                                date: item.date ?? '',
                                credentialUrl: item.credentialUrl ?? '',
                                visible: item.visible,
                                sortOrder: item.sortOrder,
                            }}
                        />
                        <form action={deleteCertification}>
                            <input type="hidden" name="id" value={item.id} />
                            <button className="rounded-lg border border-rose-300/40 px-4 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-400/10">
                                Delete
                            </button>
                        </form>
                    </div>
                )) : (
                    <p className="rounded-lg border border-white/10 bg-slate-900/70 p-5 text-sm text-slate-400">
                        No certifications yet.
                    </p>
                )}
            </section>
        </div>
    );
}

type CertificationFormValues = {
    id?: number;
    name?: string;
    issuer?: string;
    date?: string;
    credentialUrl?: string;
    visible?: boolean;
    sortOrder?: number;
};

function CertificationForm({
    action,
    submitLabel,
    values = {},
}: {
    action: (formData: FormData) => Promise<void>;
    submitLabel: string;
    values?: CertificationFormValues;
}) {
    return (
        <form action={action} className="space-y-5 rounded-lg border border-white/10 bg-slate-900/70 p-5">
            {values.id ? <input type="hidden" name="id" value={values.id} /> : null}
            <div className="grid gap-5 md:grid-cols-2">
                <FormField label="Name" name="name" required defaultValue={values.name} />
                <FormField label="Issuer" name="issuer" defaultValue={values.issuer} />
                <FormField label="Date" name="date" defaultValue={values.date} />
                <FormField label="Credential URL" name="credentialUrl" type="url" defaultValue={values.credentialUrl} />
                <FormField label="Sort order" name="sortOrder" type="number" defaultValue={values.sortOrder ?? 0} />
            </div>
            <CheckboxField name="visible" label="Visible on site" defaultChecked={values.visible ?? true} />
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
