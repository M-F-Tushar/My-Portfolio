import FormField from '@/components/admin/FormField';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';
import {
    checkboxValue,
    intWithDefault,
    listFromForm,
    listInputValue,
    optionalString,
    requiredId,
    requiredString,
    revalidateAdminPaths,
} from '@/lib/admin/forms';

function readExperienceData(formData: FormData) {
    return {
        organization: requiredString(formData, 'organization', 'Organization'),
        role: requiredString(formData, 'role', 'Role'),
        period: requiredString(formData, 'period', 'Period'),
        location: optionalString(formData, 'location'),
        summary: optionalString(formData, 'summary'),
        bullets: listFromForm(formData, 'bullets'),
        techStack: listFromForm(formData, 'techStack'),
        visible: checkboxValue(formData, 'visible'),
        sortOrder: intWithDefault(formData, 'sortOrder'),
    };
}

async function createExperience(formData: FormData) {
    'use server';

    await requireAdmin();
    await prisma.experience.create({ data: readExperienceData(formData) });
    revalidateAdminPaths('/admin/experience', ['/']);
}

async function updateExperience(formData: FormData) {
    'use server';

    await requireAdmin();
    await prisma.experience.update({ where: { id: requiredId(formData) }, data: readExperienceData(formData) });
    revalidateAdminPaths('/admin/experience', ['/']);
}

async function deleteExperience(formData: FormData) {
    'use server';

    await requireAdmin();
    await prisma.experience.delete({ where: { id: requiredId(formData) } });
    revalidateAdminPaths('/admin/experience', ['/']);
}

export default async function AdminExperiencePage() {
    const experience = await prisma.experience.findMany({
        orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
    });

    return (
        <div className="space-y-8">
            <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Experience</p>
                <h1 className="text-3xl font-semibold tracking-tight text-white">Manage experience</h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-400">
                    Add internships, roles, research work, and notable applied learning entries.
                </p>
            </section>

            <ExperienceForm action={createExperience} submitLabel="Create experience" />

            <section className="space-y-5">
                <h2 className="text-xl font-semibold text-white">Current experience</h2>
                {experience.length ? experience.map((item) => (
                    <div key={item.id} className="space-y-4 rounded-lg border border-white/10 bg-slate-900/70 p-5">
                        <ExperienceForm
                            action={updateExperience}
                            submitLabel="Save experience"
                            values={{
                                id: item.id,
                                organization: item.organization,
                                role: item.role,
                                period: item.period,
                                location: item.location ?? '',
                                summary: item.summary ?? '',
                                bullets: listInputValue(item.bullets),
                                techStack: listInputValue(item.techStack),
                                visible: item.visible,
                                sortOrder: item.sortOrder,
                            }}
                        />
                        <form action={deleteExperience}>
                            <input type="hidden" name="id" value={item.id} />
                            <button className="rounded-lg border border-rose-300/40 px-4 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-400/10">
                                Delete
                            </button>
                        </form>
                    </div>
                )) : (
                    <p className="rounded-lg border border-white/10 bg-slate-900/70 p-5 text-sm text-slate-400">
                        No experience entries yet.
                    </p>
                )}
            </section>
        </div>
    );
}

type ExperienceFormValues = {
    id?: number;
    organization?: string;
    role?: string;
    period?: string;
    location?: string;
    summary?: string;
    bullets?: string;
    techStack?: string;
    visible?: boolean;
    sortOrder?: number;
};

function ExperienceForm({
    action,
    submitLabel,
    values = {},
}: {
    action: (formData: FormData) => Promise<void>;
    submitLabel: string;
    values?: ExperienceFormValues;
}) {
    return (
        <form action={action} className="space-y-5 rounded-lg border border-white/10 bg-slate-900/70 p-5">
            {values.id ? <input type="hidden" name="id" value={values.id} /> : null}
            <div className="grid gap-5 md:grid-cols-2">
                <FormField label="Organization" name="organization" required defaultValue={values.organization} />
                <FormField label="Role" name="role" required defaultValue={values.role} />
                <FormField label="Period" name="period" required defaultValue={values.period} />
                <FormField label="Location" name="location" defaultValue={values.location} />
                <FormField label="Sort order" name="sortOrder" type="number" defaultValue={values.sortOrder ?? 0} />
            </div>
            <FormField label="Summary" name="summary" textarea rows={4} defaultValue={values.summary} />
            <FormField label="Bullets" name="bullets" hint="One per line." textarea rows={4} defaultValue={values.bullets} />
            <FormField
                label="Tech stack"
                name="techStack"
                hint="Comma-separated or one per line."
                textarea
                rows={3}
                defaultValue={values.techStack}
            />
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
