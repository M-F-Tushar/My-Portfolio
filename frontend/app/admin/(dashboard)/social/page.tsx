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

function readSocialLinkData(formData: FormData) {
    return {
        label: requiredString(formData, 'label', 'Label'),
        platform: requiredString(formData, 'platform', 'Platform'),
        url: requiredString(formData, 'url', 'URL'),
        visible: checkboxValue(formData, 'visible'),
        sortOrder: intWithDefault(formData, 'sortOrder'),
    };
}

async function createSocialLink(formData: FormData) {
    'use server';

    await requireAdmin();
    await prisma.socialLink.create({ data: readSocialLinkData(formData) });
    revalidateAdminPaths('/admin/social', ['/']);
}

async function updateSocialLink(formData: FormData) {
    'use server';

    await requireAdmin();
    await prisma.socialLink.update({ where: { id: requiredId(formData) }, data: readSocialLinkData(formData) });
    revalidateAdminPaths('/admin/social', ['/']);
}

async function deleteSocialLink(formData: FormData) {
    'use server';

    await requireAdmin();
    await prisma.socialLink.delete({ where: { id: requiredId(formData) } });
    revalidateAdminPaths('/admin/social', ['/']);
}

export default async function AdminSocialPage() {
    const links = await prisma.socialLink.findMany({
        orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
    });

    return (
        <div className="space-y-8">
            <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Social</p>
                <h1 className="text-3xl font-semibold tracking-tight text-white">Manage social links</h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-400">
                    Add contact and profile links shown in the public contact section.
                </p>
            </section>

            <SocialForm action={createSocialLink} submitLabel="Create social link" />

            <section className="space-y-5">
                <h2 className="text-xl font-semibold text-white">Current social links</h2>
                {links.length ? links.map((link) => (
                    <div key={link.id} className="space-y-4 rounded-lg border border-white/10 bg-slate-900/70 p-5">
                        <SocialForm
                            action={updateSocialLink}
                            submitLabel="Save social link"
                            values={{
                                id: link.id,
                                label: link.label,
                                platform: link.platform,
                                url: link.url,
                                visible: link.visible,
                                sortOrder: link.sortOrder,
                            }}
                        />
                        <form action={deleteSocialLink}>
                            <input type="hidden" name="id" value={link.id} />
                            <button className="rounded-lg border border-rose-300/40 px-4 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-400/10">
                                Delete
                            </button>
                        </form>
                    </div>
                )) : (
                    <p className="rounded-lg border border-white/10 bg-slate-900/70 p-5 text-sm text-slate-400">
                        No social links yet.
                    </p>
                )}
            </section>
        </div>
    );
}

type SocialFormValues = {
    id?: number;
    label?: string;
    platform?: string;
    url?: string;
    visible?: boolean;
    sortOrder?: number;
};

function SocialForm({
    action,
    submitLabel,
    values = {},
}: {
    action: (formData: FormData) => Promise<void>;
    submitLabel: string;
    values?: SocialFormValues;
}) {
    return (
        <form action={action} className="space-y-5 rounded-lg border border-white/10 bg-slate-900/70 p-5">
            {values.id ? <input type="hidden" name="id" value={values.id} /> : null}
            <div className="grid gap-5 md:grid-cols-2">
                <FormField label="Label" name="label" required defaultValue={values.label} />
                <FormField label="Platform" name="platform" required defaultValue={values.platform} />
                <FormField label="URL" name="url" type="url" required defaultValue={values.url} />
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
