import FormField from '@/components/admin/FormField';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';
import {
    checkboxValue,
    intWithDefault,
    requiredId,
    requiredString,
    revalidateAdminPaths,
} from '@/lib/admin/forms';

const selectClassName =
    'mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15';

async function createCategory(formData: FormData) {
    'use server';

    await requireAdmin();

    await prisma.skillCategory.create({
        data: {
            name: requiredString(formData, 'name', 'Category name'),
            sortOrder: intWithDefault(formData, 'sortOrder'),
            visible: checkboxValue(formData, 'visible'),
        },
    });

    revalidateAdminPaths('/admin/skills');
}

async function updateCategory(formData: FormData) {
    'use server';

    await requireAdmin();

    await prisma.skillCategory.update({
        where: { id: requiredId(formData) },
        data: {
            name: requiredString(formData, 'name', 'Category name'),
            sortOrder: intWithDefault(formData, 'sortOrder'),
            visible: checkboxValue(formData, 'visible'),
        },
    });

    revalidateAdminPaths('/admin/skills');
}

async function deleteCategory(formData: FormData) {
    'use server';

    await requireAdmin();
    await prisma.skillCategory.delete({ where: { id: requiredId(formData) } });
    revalidateAdminPaths('/admin/skills');
}

async function createSkill(formData: FormData) {
    'use server';

    await requireAdmin();

    await prisma.skill.create({
        data: {
            name: requiredString(formData, 'name', 'Skill name'),
            proficiency: intWithDefault(formData, 'proficiency', 70),
            sortOrder: intWithDefault(formData, 'sortOrder'),
            visible: checkboxValue(formData, 'visible'),
            categoryId: intWithDefault(formData, 'categoryId'),
        },
    });

    revalidateAdminPaths('/admin/skills');
}

async function updateSkill(formData: FormData) {
    'use server';

    await requireAdmin();

    await prisma.skill.update({
        where: { id: requiredId(formData) },
        data: {
            name: requiredString(formData, 'name', 'Skill name'),
            proficiency: intWithDefault(formData, 'proficiency', 70),
            sortOrder: intWithDefault(formData, 'sortOrder'),
            visible: checkboxValue(formData, 'visible'),
            categoryId: intWithDefault(formData, 'categoryId'),
        },
    });

    revalidateAdminPaths('/admin/skills');
}

async function deleteSkill(formData: FormData) {
    'use server';

    await requireAdmin();
    await prisma.skill.delete({ where: { id: requiredId(formData) } });
    revalidateAdminPaths('/admin/skills');
}

export default async function AdminSkillsPage() {
    const categories = await prisma.skillCategory.findMany({
        include: {
            skills: {
                orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
            },
        },
        orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
    });

    return (
        <div className="space-y-8">
            <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Skills</p>
                <h1 className="text-3xl font-semibold tracking-tight text-white">Manage skills</h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-400">
                    Create skill groups, then add individual skills to the right group.
                </p>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
                <form action={createCategory} className="space-y-4 rounded-lg border border-white/10 bg-slate-900/70 p-5">
                    <h2 className="text-lg font-semibold text-white">Add category</h2>
                    <FormField label="Category name" name="name" required />
                    <FormField label="Sort order" name="sortOrder" type="number" defaultValue={0} />
                    <CheckboxField name="visible" label="Visible on site" defaultChecked />
                    <button className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200">
                        Create category
                    </button>
                </form>

                <form action={createSkill} className="space-y-4 rounded-lg border border-white/10 bg-slate-900/70 p-5">
                    <h2 className="text-lg font-semibold text-white">Add skill</h2>
                    <FormField label="Skill name" name="name" required />
                    <label className="block text-sm font-medium text-slate-200">
                        Category
                        <select name="categoryId" required className={selectClassName}>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </label>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField label="Proficiency" name="proficiency" type="number" min={0} max={100} defaultValue={70} />
                        <FormField label="Sort order" name="sortOrder" type="number" defaultValue={0} />
                    </div>
                    <CheckboxField name="visible" label="Visible on site" defaultChecked />
                    <button className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200">
                        Create skill
                    </button>
                </form>
            </section>

            <section className="space-y-5">
                <h2 className="text-xl font-semibold text-white">Current skill categories</h2>
                {categories.length ? categories.map((category) => (
                    <div key={category.id} className="space-y-4 rounded-lg border border-white/10 bg-slate-900/70 p-5">
                        <form action={updateCategory} className="grid gap-4 lg:grid-cols-[1fr_8rem_auto_auto] lg:items-end">
                            <input type="hidden" name="id" value={category.id} />
                            <FormField label="Category name" name="name" required defaultValue={category.name} />
                            <FormField label="Sort" name="sortOrder" type="number" defaultValue={category.sortOrder} />
                            <CheckboxField name="visible" label="Visible" defaultChecked={category.visible} />
                            <button className="rounded-lg border border-cyan-300/40 px-4 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-300/10">
                                Save
                            </button>
                        </form>
                        <form action={deleteCategory}>
                            <input type="hidden" name="id" value={category.id} />
                            <button className="rounded-lg border border-rose-300/40 px-4 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-400/10">
                                Delete category
                            </button>
                        </form>

                        <div className="space-y-3 border-t border-white/10 pt-4">
                            {category.skills.length ? category.skills.map((skill) => (
                                <form key={skill.id} action={updateSkill} className="grid gap-4 rounded-lg border border-white/10 bg-slate-950/40 p-4 lg:grid-cols-[1fr_10rem_7rem_7rem_auto_auto] lg:items-end">
                                    <input type="hidden" name="id" value={skill.id} />
                                    <FormField label="Skill" name="name" required defaultValue={skill.name} />
                                    <label className="block text-sm font-medium text-slate-200">
                                        Category
                                        <select name="categoryId" defaultValue={skill.categoryId} required className={selectClassName}>
                                            {categories.map((item) => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))}
                                        </select>
                                    </label>
                                    <FormField label="Level" name="proficiency" type="number" min={0} max={100} defaultValue={skill.proficiency} />
                                    <FormField label="Sort" name="sortOrder" type="number" defaultValue={skill.sortOrder} />
                                    <CheckboxField name="visible" label="Visible" defaultChecked={skill.visible} />
                                    <button className="rounded-lg border border-cyan-300/40 px-4 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-300/10">
                                        Save
                                    </button>
                                </form>
                            )) : (
                                <p className="text-sm text-slate-400">No skills in this category yet.</p>
                            )}
                            {category.skills.map((skill) => (
                                <form key={`delete-${skill.id}`} action={deleteSkill}>
                                    <input type="hidden" name="id" value={skill.id} />
                                    <button className="rounded-lg border border-rose-300/40 px-3 py-1.5 text-xs font-semibold text-rose-100 hover:bg-rose-400/10">
                                        Delete {skill.name}
                                    </button>
                                </form>
                            ))}
                        </div>
                    </div>
                )) : (
                    <p className="rounded-lg border border-white/10 bg-slate-900/70 p-5 text-sm text-slate-400">
                        No skill categories yet.
                    </p>
                )}
            </section>
        </div>
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
