import { ProjectStatus } from '@prisma/client';
import FormField from '@/components/admin/FormField';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';
import { toSlug } from '@/lib/content/json';
import {
    checkboxValue,
    enumValue,
    intWithDefault,
    listFromForm,
    listInputValue,
    optionalString,
    requiredId,
    requiredString,
    revalidateAdminPaths,
} from '@/lib/admin/forms';

const projectStatuses = [
    ProjectStatus.COMPLETED,
    ProjectStatus.IN_PROGRESS,
    ProjectStatus.COMING_SOON,
] as const;

const selectClassName =
    'mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15';

function readProjectData(formData: FormData) {
    const title = requiredString(formData, 'title', 'Title');
    const requestedSlug = optionalString(formData, 'slug') ?? toSlug(title);
    const slug = toSlug(requestedSlug);

    if (!slug) {
        throw new Error('Slug is required.');
    }

    return {
        title,
        slug,
        description: requiredString(formData, 'description', 'Description'),
        category: requiredString(formData, 'category', 'Category'),
        techStack: listFromForm(formData, 'techStack'),
        githubUrl: optionalString(formData, 'githubUrl'),
        liveDemoUrl: optionalString(formData, 'liveDemoUrl'),
        caseStudyUrl: optionalString(formData, 'caseStudyUrl'),
        status: enumValue(formData, 'status', projectStatuses, ProjectStatus.IN_PROGRESS),
        featured: checkboxValue(formData, 'featured'),
        visible: checkboxValue(formData, 'visible'),
        sortOrder: intWithDefault(formData, 'sortOrder'),
    };
}

async function createProject(formData: FormData) {
    'use server';

    await requireAdmin();
    await prisma.project.create({ data: readProjectData(formData) });
    revalidateAdminPaths('/admin/projects', ['/', '/projects']);
}

async function updateProject(formData: FormData) {
    'use server';

    await requireAdmin();
    await prisma.project.update({ where: { id: requiredId(formData) }, data: readProjectData(formData) });
    revalidateAdminPaths('/admin/projects', ['/', '/projects']);
}

async function deleteProject(formData: FormData) {
    'use server';

    await requireAdmin();
    await prisma.project.delete({ where: { id: requiredId(formData) } });
    revalidateAdminPaths('/admin/projects', ['/', '/projects']);
}

export default async function AdminProjectsPage() {
    const projects = await prisma.project.findMany({
        orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
    });

    return (
        <div className="space-y-8">
            <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Projects</p>
                <h1 className="text-3xl font-semibold tracking-tight text-white">Manage projects</h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-400">
                    Publish portfolio projects, links, status, and featured visibility.
                </p>
            </section>

            <ProjectForm action={createProject} submitLabel="Create project" />

            <section className="space-y-5">
                <h2 className="text-xl font-semibold text-white">Current projects</h2>
                {projects.length ? projects.map((project) => (
                    <div key={project.id} className="space-y-4 rounded-lg border border-white/10 bg-slate-900/70 p-5">
                        <ProjectForm
                            action={updateProject}
                            submitLabel="Save project"
                            values={{
                                id: project.id,
                                title: project.title,
                                slug: project.slug,
                                description: project.description,
                                category: project.category,
                                techStack: listInputValue(project.techStack),
                                githubUrl: project.githubUrl ?? '',
                                liveDemoUrl: project.liveDemoUrl ?? '',
                                caseStudyUrl: project.caseStudyUrl ?? '',
                                status: project.status,
                                featured: project.featured,
                                visible: project.visible,
                                sortOrder: project.sortOrder,
                            }}
                        />
                        <form action={deleteProject}>
                            <input type="hidden" name="id" value={project.id} />
                            <button className="rounded-lg border border-rose-300/40 px-4 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-400/10">
                                Delete
                            </button>
                        </form>
                    </div>
                )) : (
                    <p className="rounded-lg border border-white/10 bg-slate-900/70 p-5 text-sm text-slate-400">
                        No projects yet.
                    </p>
                )}
            </section>
        </div>
    );
}

type ProjectFormValues = {
    id?: number;
    title?: string;
    slug?: string;
    description?: string;
    category?: string;
    techStack?: string;
    githubUrl?: string;
    liveDemoUrl?: string;
    caseStudyUrl?: string;
    status?: ProjectStatus;
    featured?: boolean;
    visible?: boolean;
    sortOrder?: number;
};

function ProjectForm({
    action,
    submitLabel,
    values = {},
}: {
    action: (formData: FormData) => Promise<void>;
    submitLabel: string;
    values?: ProjectFormValues;
}) {
    return (
        <form action={action} className="space-y-5 rounded-lg border border-white/10 bg-slate-900/70 p-5">
            {values.id ? <input type="hidden" name="id" value={values.id} /> : null}
            <div className="grid gap-5 md:grid-cols-2">
                <FormField label="Title" name="title" required defaultValue={values.title} />
                <FormField label="Slug" name="slug" hint="Leave blank when creating to use the title." defaultValue={values.slug} />
                <FormField label="Category" name="category" required defaultValue={values.category} />
                <FormField label="Sort order" name="sortOrder" type="number" defaultValue={values.sortOrder ?? 0} />
            </div>
            <FormField label="Description" name="description" required textarea rows={4} defaultValue={values.description} />
            <FormField
                label="Tech stack"
                name="techStack"
                hint="Comma-separated or one per line."
                textarea
                rows={3}
                defaultValue={values.techStack}
            />
            <div className="grid gap-5 md:grid-cols-3">
                <FormField label="GitHub URL" name="githubUrl" type="url" defaultValue={values.githubUrl} />
                <FormField label="Live demo URL" name="liveDemoUrl" type="url" defaultValue={values.liveDemoUrl} />
                <FormField label="Case study URL" name="caseStudyUrl" type="url" defaultValue={values.caseStudyUrl} />
            </div>
            <label className="block text-sm font-medium text-slate-200">
                Status
                <select name="status" defaultValue={values.status ?? ProjectStatus.IN_PROGRESS} className={selectClassName}>
                    {projectStatuses.map((status) => (
                        <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>
                    ))}
                </select>
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
                <CheckboxField name="featured" label="Featured on home page" defaultChecked={values.featured ?? false} />
                <CheckboxField name="visible" label="Visible on site" defaultChecked={values.visible ?? true} />
            </div>
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
