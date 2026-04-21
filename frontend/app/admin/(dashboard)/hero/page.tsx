import FormField from '@/components/admin/FormField';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';
import { listFromForm, listInputValue, requiredString, revalidateAdminPaths } from '@/lib/admin/forms';

async function saveHero(formData: FormData) {
    'use server';

    await requireAdmin();

    const data = {
        eyebrow: requiredString(formData, 'eyebrow', 'Eyebrow'),
        headline: requiredString(formData, 'headline', 'Headline'),
        subheadline: requiredString(formData, 'subheadline', 'Subheadline'),
        primaryLabel: requiredString(formData, 'primaryLabel', 'Primary label'),
        primaryHref: requiredString(formData, 'primaryHref', 'Primary href'),
        secondaryLabel: requiredString(formData, 'secondaryLabel', 'Secondary label'),
        secondaryHref: requiredString(formData, 'secondaryHref', 'Secondary href'),
        featuredChips: listFromForm(formData, 'featuredChips'),
    };

    await prisma.hero.upsert({
        where: { id: 1 },
        update: data,
        create: { id: 1, ...data },
    });

    revalidateAdminPaths('/admin/hero', ['/']);
}

export default async function AdminHeroPage() {
    const hero = await prisma.hero.findUnique({ where: { id: 1 } });

    return (
        <div className="space-y-8">
            <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Hero</p>
                <h1 className="text-3xl font-semibold tracking-tight text-white">Edit hero section</h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-400">
                    Control the lead message, call-to-action links, and featured chips on the home page.
                </p>
            </section>

            <form action={saveHero} className="space-y-6 rounded-lg border border-white/10 bg-slate-900/70 p-5">
                <FormField label="Eyebrow" name="eyebrow" required defaultValue={hero?.eyebrow} />
                <FormField label="Headline" name="headline" required textarea rows={3} defaultValue={hero?.headline} />
                <FormField
                    label="Subheadline"
                    name="subheadline"
                    required
                    textarea
                    rows={3}
                    defaultValue={hero?.subheadline}
                />
                <div className="grid gap-5 md:grid-cols-2">
                    <FormField label="Primary label" name="primaryLabel" required defaultValue={hero?.primaryLabel} />
                    <FormField label="Primary href" name="primaryHref" required defaultValue={hero?.primaryHref} />
                    <FormField label="Secondary label" name="secondaryLabel" required defaultValue={hero?.secondaryLabel} />
                    <FormField label="Secondary href" name="secondaryHref" required defaultValue={hero?.secondaryHref} />
                </div>
                <FormField
                    label="Featured chips"
                    name="featuredChips"
                    hint="Comma-separated values, for example: LLMs, Machine Learning, MLOps"
                    defaultValue={listInputValue(hero?.featuredChips)}
                />
                <div className="flex justify-end">
                    <button className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200">
                        Save hero
                    </button>
                </div>
            </form>
        </div>
    );
}
