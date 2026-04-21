import { AchievementType } from '@prisma/client';
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

const achievementTypes = [
    AchievementType.AWARD,
    AchievementType.HACKATHON,
    AchievementType.COMPETITION,
    AchievementType.SCHOLARSHIP,
    AchievementType.RECOGNITION,
] as const;

const selectClassName =
    'mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15';

function readAchievementData(formData: FormData) {
    return {
        title: requiredString(formData, 'title', 'Title'),
        type: enumValue(formData, 'type', achievementTypes, AchievementType.RECOGNITION),
        organization: optionalString(formData, 'organization'),
        date: optionalString(formData, 'date'),
        description: optionalString(formData, 'description'),
        url: optionalString(formData, 'url'),
        visible: checkboxValue(formData, 'visible'),
        sortOrder: intWithDefault(formData, 'sortOrder'),
    };
}

async function createAchievement(formData: FormData) {
    'use server';

    await requireAdmin();
    await prisma.achievement.create({ data: readAchievementData(formData) });
    revalidateAdminPaths('/admin/achievements');
}

async function updateAchievement(formData: FormData) {
    'use server';

    await requireAdmin();
    await prisma.achievement.update({ where: { id: requiredId(formData) }, data: readAchievementData(formData) });
    revalidateAdminPaths('/admin/achievements');
}

async function deleteAchievement(formData: FormData) {
    'use server';

    await requireAdmin();
    await prisma.achievement.delete({ where: { id: requiredId(formData) } });
    revalidateAdminPaths('/admin/achievements');
}

export default async function AdminAchievementsPage() {
    const achievements = await prisma.achievement.findMany({
        orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
    });

    return (
        <div className="space-y-8">
            <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Achievements</p>
                <h1 className="text-3xl font-semibold tracking-tight text-white">Manage achievements</h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-400">
                    Add awards, hackathons, competitions, scholarships, and recognition. New entries stay hidden until visible is checked.
                </p>
            </section>

            <AchievementForm action={createAchievement} submitLabel="Create achievement" />

            <section className="space-y-5">
                <h2 className="text-xl font-semibold text-white">Current achievements</h2>
                {achievements.length ? achievements.map((item) => (
                    <div key={item.id} className="space-y-4 rounded-lg border border-white/10 bg-slate-900/70 p-5">
                        <AchievementForm
                            action={updateAchievement}
                            submitLabel="Save achievement"
                            values={{
                                id: item.id,
                                title: item.title,
                                type: item.type,
                                organization: item.organization ?? '',
                                date: item.date ?? '',
                                description: item.description ?? '',
                                url: item.url ?? '',
                                visible: item.visible,
                                sortOrder: item.sortOrder,
                            }}
                        />
                        <form action={deleteAchievement}>
                            <input type="hidden" name="id" value={item.id} />
                            <button className="rounded-lg border border-rose-300/40 px-4 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-400/10">
                                Delete
                            </button>
                        </form>
                    </div>
                )) : (
                    <p className="rounded-lg border border-white/10 bg-slate-900/70 p-5 text-sm text-slate-400">
                        No achievements yet.
                    </p>
                )}
            </section>
        </div>
    );
}

type AchievementFormValues = {
    id?: number;
    title?: string;
    type?: AchievementType;
    organization?: string;
    date?: string;
    description?: string;
    url?: string;
    visible?: boolean;
    sortOrder?: number;
};

function AchievementForm({
    action,
    submitLabel,
    values = {},
}: {
    action: (formData: FormData) => Promise<void>;
    submitLabel: string;
    values?: AchievementFormValues;
}) {
    return (
        <form action={action} className="space-y-5 rounded-lg border border-white/10 bg-slate-900/70 p-5">
            {values.id ? <input type="hidden" name="id" value={values.id} /> : null}
            <div className="grid gap-5 md:grid-cols-2">
                <FormField label="Title" name="title" required defaultValue={values.title} />
                <label className="block text-sm font-medium text-slate-200">
                    Type
                    <select name="type" defaultValue={values.type ?? AchievementType.RECOGNITION} className={selectClassName}>
                        {achievementTypes.map((type) => (
                            <option key={type} value={type}>{type.replaceAll('_', ' ')}</option>
                        ))}
                    </select>
                </label>
                <FormField label="Organization" name="organization" defaultValue={values.organization} />
                <FormField label="Date" name="date" defaultValue={values.date} />
                <FormField label="URL" name="url" type="url" defaultValue={values.url} />
                <FormField label="Sort order" name="sortOrder" type="number" defaultValue={values.sortOrder ?? 0} />
            </div>
            <FormField label="Description" name="description" textarea rows={4} defaultValue={values.description} />
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
