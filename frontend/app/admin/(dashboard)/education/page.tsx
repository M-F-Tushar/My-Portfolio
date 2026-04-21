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

function readEducationData(formData: FormData) {
    return {
        degree: requiredString(formData, 'degree', 'Degree'),
        institution: requiredString(formData, 'institution', 'Institution'),
        period: requiredString(formData, 'period', 'Period'),
        location: optionalString(formData, 'location'),
        coursework: listFromForm(formData, 'coursework'),
        gpa: optionalString(formData, 'gpa'),
        description: optionalString(formData, 'description'),
        visible: checkboxValue(formData, 'visible'),
        sortOrder: intWithDefault(formData, 'sortOrder'),
    };
}

async function createEducation(formData: FormData) {
    'use server';

    await requireAdmin();
    await prisma.education.create({ data: readEducationData(formData) });
    revalidateAdminPaths('/admin/education', ['/']);
}

async function updateEducation(formData: FormData) {
    'use server';

    await requireAdmin();
    await prisma.education.update({ where: { id: requiredId(formData) }, data: readEducationData(formData) });
    revalidateAdminPaths('/admin/education', ['/']);
}

async function deleteEducation(formData: FormData) {
    'use server';

    await requireAdmin();
    await prisma.education.delete({ where: { id: requiredId(formData) } });
    revalidateAdminPaths('/admin/education', ['/']);
}

export default async function AdminEducationPage() {
    const education = await prisma.education.findMany({
        orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
    });

    return (
        <div className="space-y-8">
            <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Education</p>
                <h1 className="text-3xl font-semibold tracking-tight text-white">Manage education</h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-400">
                    Keep degrees, coursework, GPA, and academic descriptions current.
                </p>
            </section>

            <EducationForm action={createEducation} submitLabel="Create education" />

            <section className="space-y-5">
                <h2 className="text-xl font-semibold text-white">Current education</h2>
                {education.length ? education.map((item) => (
                    <div key={item.id} className="space-y-4 rounded-lg border border-white/10 bg-slate-900/70 p-5">
                        <EducationForm
                            action={updateEducation}
                            submitLabel="Save education"
                            values={{
                                id: item.id,
                                degree: item.degree,
                                institution: item.institution,
                                period: item.period,
                                location: item.location ?? '',
                                coursework: listInputValue(item.coursework),
                                gpa: item.gpa ?? '',
                                description: item.description ?? '',
                                visible: item.visible,
                                sortOrder: item.sortOrder,
                            }}
                        />
                        <form action={deleteEducation}>
                            <input type="hidden" name="id" value={item.id} />
                            <button className="rounded-lg border border-rose-300/40 px-4 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-400/10">
                                Delete
                            </button>
                        </form>
                    </div>
                )) : (
                    <p className="rounded-lg border border-white/10 bg-slate-900/70 p-5 text-sm text-slate-400">
                        No education entries yet.
                    </p>
                )}
            </section>
        </div>
    );
}

type EducationFormValues = {
    id?: number;
    degree?: string;
    institution?: string;
    period?: string;
    location?: string;
    coursework?: string;
    gpa?: string;
    description?: string;
    visible?: boolean;
    sortOrder?: number;
};

function EducationForm({
    action,
    submitLabel,
    values = {},
}: {
    action: (formData: FormData) => Promise<void>;
    submitLabel: string;
    values?: EducationFormValues;
}) {
    return (
        <form action={action} className="space-y-5 rounded-lg border border-white/10 bg-slate-900/70 p-5">
            {values.id ? <input type="hidden" name="id" value={values.id} /> : null}
            <div className="grid gap-5 md:grid-cols-2">
                <FormField label="Degree" name="degree" required defaultValue={values.degree} />
                <FormField label="Institution" name="institution" required defaultValue={values.institution} />
                <FormField label="Period" name="period" required defaultValue={values.period} />
                <FormField label="Location" name="location" defaultValue={values.location} />
                <FormField label="GPA" name="gpa" defaultValue={values.gpa} />
                <FormField label="Sort order" name="sortOrder" type="number" defaultValue={values.sortOrder ?? 0} />
            </div>
            <FormField
                label="Coursework"
                name="coursework"
                hint="Comma-separated or one per line."
                textarea
                rows={3}
                defaultValue={values.coursework}
            />
            <FormField label="Description" name="description" textarea rows={4} defaultValue={values.description} />
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
