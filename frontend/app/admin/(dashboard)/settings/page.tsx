import FormField from '@/components/admin/FormField';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';
import { checkboxValue, requiredString, revalidateAdminPaths } from '@/lib/admin/forms';

async function saveSettings(formData: FormData) {
    'use server';

    await requireAdmin();

    const data = {
        siteName: requiredString(formData, 'siteName', 'Site name'),
        seoTitle: requiredString(formData, 'seoTitle', 'SEO title'),
        seoDescription: requiredString(formData, 'seoDescription', 'SEO description'),
        showDemosInNav: checkboxValue(formData, 'showDemosInNav'),
    };

    await prisma.siteSettings.upsert({
        where: { id: 1 },
        update: data,
        create: { id: 1, ...data },
    });

    revalidateAdminPaths('/admin/settings', ['/', '/projects', '/demos', '/resume']);
}

export default async function AdminSettingsPage() {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

    return (
        <div className="space-y-8">
            <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Settings</p>
                <h1 className="text-3xl font-semibold tracking-tight text-white">Edit site settings</h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-400">
                    Update the site identity, metadata copy, and the public demos navigation switch.
                </p>
            </section>

            <form action={saveSettings} className="space-y-6 rounded-lg border border-white/10 bg-slate-900/70 p-5">
                <FormField label="Site name" name="siteName" required defaultValue={settings?.siteName} />
                <FormField label="SEO title" name="seoTitle" required defaultValue={settings?.seoTitle} />
                <FormField
                    label="SEO description"
                    name="seoDescription"
                    required
                    textarea
                    rows={4}
                    defaultValue={settings?.seoDescription}
                />
                <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-200">
                    <input
                        type="checkbox"
                        name="showDemosInNav"
                        defaultChecked={settings?.showDemosInNav ?? false}
                        className="h-4 w-4 rounded border-white/20 bg-slate-950 text-cyan-300"
                    />
                    Show demos in public navigation
                </label>
                <div className="flex justify-end">
                    <button className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200">
                        Save settings
                    </button>
                </div>
            </form>
        </div>
    );
}
