import FormField from '@/components/admin/FormField';
import type { ReactNode } from 'react';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';
import { listFromForm, listInputValue, requiredString, revalidateAdminPaths } from '@/lib/admin/forms';
import {
    homepageContentDefaults,
    labelValueItemsToTextarea,
    labelValueTextareaToJson,
} from '@/lib/content/homepage';

async function saveHomepage(formData: FormData) {
    'use server';

    await requireAdmin();

    const data = {
        heroStatus: requiredString(formData, 'heroStatus', 'Hero status'),
        heroMetricOneValue: requiredString(formData, 'heroMetricOneValue', 'Hero metric one value'),
        heroMetricOneLabel: requiredString(formData, 'heroMetricOneLabel', 'Hero metric one label'),
        heroMetricTwoValue: requiredString(formData, 'heroMetricTwoValue', 'Hero metric two value'),
        heroMetricTwoLabel: requiredString(formData, 'heroMetricTwoLabel', 'Hero metric two label'),
        heroOrbitSignals: listFromForm(formData, 'heroOrbitSignals'),
        heroWorkflowStages: labelValueTextareaToJson(requiredString(formData, 'heroWorkflowStages', 'Hero workflow stages')),
        heroOutputTags: listFromForm(formData, 'heroOutputTags'),
        aboutKicker: requiredString(formData, 'aboutKicker', 'About kicker'),
        aboutHeading: requiredString(formData, 'aboutHeading', 'About heading'),
        aboutBody: requiredString(formData, 'aboutBody', 'About body'),
        aboutScanTags: listFromForm(formData, 'aboutScanTags'),
        candidateSignals: labelValueTextareaToJson(requiredString(formData, 'candidateSignals', 'Candidate signals')),
        skillsKicker: requiredString(formData, 'skillsKicker', 'Skills kicker'),
        skillsHeading: requiredString(formData, 'skillsHeading', 'Skills heading'),
        skillsSummary: requiredString(formData, 'skillsSummary', 'Skills summary'),
        projectsKicker: requiredString(formData, 'projectsKicker', 'Projects kicker'),
        projectsHeading: requiredString(formData, 'projectsHeading', 'Projects heading'),
        projectsLinkLabel: requiredString(formData, 'projectsLinkLabel', 'Projects link label'),
        projectsPageKicker: requiredString(formData, 'projectsPageKicker', 'Projects page kicker'),
        projectsPageHeading: requiredString(formData, 'projectsPageHeading', 'Projects page heading'),
        projectsPageSummary: requiredString(formData, 'projectsPageSummary', 'Projects page summary'),
        demosPageKicker: requiredString(formData, 'demosPageKicker', 'Demos page kicker'),
        demosPageHeading: requiredString(formData, 'demosPageHeading', 'Demos page heading'),
        demosPageSummary: requiredString(formData, 'demosPageSummary', 'Demos page summary'),
        resumePageKicker: requiredString(formData, 'resumePageKicker', 'Resume page kicker'),
        processKicker: requiredString(formData, 'processKicker', 'Process kicker'),
        processHeading: requiredString(formData, 'processHeading', 'Process heading'),
        processSummary: requiredString(formData, 'processSummary', 'Process summary'),
        processSteps: labelValueTextareaToJson(requiredString(formData, 'processSteps', 'Process steps')),
        experienceKicker: requiredString(formData, 'experienceKicker', 'Experience kicker'),
        experienceHeading: requiredString(formData, 'experienceHeading', 'Experience heading'),
        experienceSummary: requiredString(formData, 'experienceSummary', 'Experience summary'),
        educationKicker: requiredString(formData, 'educationKicker', 'Education kicker'),
        educationHeading: requiredString(formData, 'educationHeading', 'Education heading'),
        educationSummary: requiredString(formData, 'educationSummary', 'Education summary'),
        achievementsKicker: requiredString(formData, 'achievementsKicker', 'Achievements kicker'),
        achievementsHeading: requiredString(formData, 'achievementsHeading', 'Achievements heading'),
        contactKicker: requiredString(formData, 'contactKicker', 'Contact kicker'),
        contactHeading: requiredString(formData, 'contactHeading', 'Contact heading'),
        contactBody: requiredString(formData, 'contactBody', 'Contact body'),
        contactTiles: labelValueTextareaToJson(requiredString(formData, 'contactTiles', 'Contact tiles')),
        finalCtaKicker: requiredString(formData, 'finalCtaKicker', 'Final CTA kicker'),
        finalCtaHeading: requiredString(formData, 'finalCtaHeading', 'Final CTA heading'),
        finalCtaBody: requiredString(formData, 'finalCtaBody', 'Final CTA body'),
        finalCtaPrimaryLabel: requiredString(formData, 'finalCtaPrimaryLabel', 'Final CTA primary label'),
        finalCtaPrimaryHref: requiredString(formData, 'finalCtaPrimaryHref', 'Final CTA primary href'),
        finalCtaSecondaryLabel: requiredString(formData, 'finalCtaSecondaryLabel', 'Final CTA secondary label'),
        finalCtaSecondaryHref: requiredString(formData, 'finalCtaSecondaryHref', 'Final CTA secondary href'),
    };

    await prisma.homepageContent.upsert({
        where: { id: 1 },
        update: data,
        create: { id: 1, ...data },
    });

    revalidateAdminPaths('/admin/homepage', ['/', '/projects', '/demos', '/resume']);
}

export default async function AdminHomepagePage() {
    await requireAdmin();

    const content = await prisma.homepageContent.findUnique({ where: { id: 1 } });
    const values = content ?? homepageContentDefaults;

    return (
        <div className="space-y-8">
            <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Homepage</p>
                <h1 className="text-3xl font-semibold tracking-tight text-white">Control home page sections</h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-400">
                    Edit the public section labels, short summaries, hero visual tags, contact tiles, and final call-to-action without touching code.
                </p>
            </section>

            <form action={saveHomepage} className="space-y-8 rounded-lg border border-white/10 bg-slate-900/70 p-5">
                <AdminSection title="Hero system">
                    <FormField label="Status pill" name="heroStatus" required defaultValue={values.heroStatus} />
                    <div className="grid gap-5 md:grid-cols-2">
                        <FormField label="Metric one value" name="heroMetricOneValue" required defaultValue={values.heroMetricOneValue} />
                        <FormField label="Metric one label" name="heroMetricOneLabel" required defaultValue={values.heroMetricOneLabel} />
                        <FormField label="Metric two value" name="heroMetricTwoValue" required defaultValue={values.heroMetricTwoValue} />
                        <FormField label="Metric two label" name="heroMetricTwoLabel" required defaultValue={values.heroMetricTwoLabel} />
                    </div>
                    <FormField label="Orbit signals" name="heroOrbitSignals" hint="Comma-separated tags around the hero portrait." defaultValue={listInputValue(values.heroOrbitSignals)} />
                    <FormField label="Workflow stages" name="heroWorkflowStages" required textarea rows={5} hint="One per line: Label | Detail" defaultValue={labelValueItemsToTextarea(values.heroWorkflowStages)} />
                    <FormField label="Output tags" name="heroOutputTags" hint="Comma-separated tags under the hero visual." defaultValue={listInputValue(values.heroOutputTags)} />
                </AdminSection>

                <AdminSection title="About and signal panel">
                    <FormField label="Kicker" name="aboutKicker" required defaultValue={values.aboutKicker} />
                    <FormField label="Heading" name="aboutHeading" required defaultValue={values.aboutHeading} />
                    <FormField label="Second paragraph" name="aboutBody" required textarea rows={4} defaultValue={values.aboutBody} />
                    <FormField label="Scan tags" name="aboutScanTags" hint="Comma-separated tags." defaultValue={listInputValue(values.aboutScanTags)} />
                    <FormField label="Candidate signals" name="candidateSignals" required textarea rows={5} hint="One per line: Label | Value" defaultValue={labelValueItemsToTextarea(values.candidateSignals)} />
                </AdminSection>

                <AdminSection title="Section headings">
                    <div className="grid gap-5 md:grid-cols-3">
                        <FormField label="Skills kicker" name="skillsKicker" required defaultValue={values.skillsKicker} />
                        <FormField label="Skills heading" name="skillsHeading" required defaultValue={values.skillsHeading} />
                        <FormField label="Skills summary" name="skillsSummary" required defaultValue={values.skillsSummary} />
                        <FormField label="Projects kicker" name="projectsKicker" required defaultValue={values.projectsKicker} />
                        <FormField label="Projects heading" name="projectsHeading" required defaultValue={values.projectsHeading} />
                        <FormField label="Projects link label" name="projectsLinkLabel" required defaultValue={values.projectsLinkLabel} />
                        <FormField label="Projects page kicker" name="projectsPageKicker" required defaultValue={values.projectsPageKicker} />
                        <FormField label="Projects page heading" name="projectsPageHeading" required defaultValue={values.projectsPageHeading} />
                        <FormField label="Projects page summary" name="projectsPageSummary" required defaultValue={values.projectsPageSummary} />
                        <FormField label="Demos page kicker" name="demosPageKicker" required defaultValue={values.demosPageKicker} />
                        <FormField label="Demos page heading" name="demosPageHeading" required defaultValue={values.demosPageHeading} />
                        <FormField label="Demos page summary" name="demosPageSummary" required defaultValue={values.demosPageSummary} />
                        <FormField label="Resume page kicker" name="resumePageKicker" required defaultValue={values.resumePageKicker} />
                        <FormField label="Experience kicker" name="experienceKicker" required defaultValue={values.experienceKicker} />
                        <FormField label="Experience heading" name="experienceHeading" required defaultValue={values.experienceHeading} />
                        <FormField label="Experience summary" name="experienceSummary" required defaultValue={values.experienceSummary} />
                        <FormField label="Education kicker" name="educationKicker" required defaultValue={values.educationKicker} />
                        <FormField label="Education heading" name="educationHeading" required defaultValue={values.educationHeading} />
                        <FormField label="Education summary" name="educationSummary" required defaultValue={values.educationSummary} />
                        <FormField label="Achievements kicker" name="achievementsKicker" required defaultValue={values.achievementsKicker} />
                        <FormField label="Achievements heading" name="achievementsHeading" required defaultValue={values.achievementsHeading} />
                    </div>
                </AdminSection>

                <AdminSection title="Process section">
                    <FormField label="Kicker" name="processKicker" required defaultValue={values.processKicker} />
                    <FormField label="Heading" name="processHeading" required defaultValue={values.processHeading} />
                    <FormField label="Summary" name="processSummary" required defaultValue={values.processSummary} />
                    <FormField label="Steps" name="processSteps" required textarea rows={5} hint="One per line: Step title | Short description" defaultValue={labelValueItemsToTextarea(values.processSteps)} />
                </AdminSection>

                <AdminSection title="Contact and final CTA">
                    <FormField label="Contact kicker" name="contactKicker" required defaultValue={values.contactKicker} />
                    <FormField label="Contact heading" name="contactHeading" required defaultValue={values.contactHeading} />
                    <FormField label="Contact body" name="contactBody" required textarea rows={3} defaultValue={values.contactBody} />
                    <FormField label="Contact tiles" name="contactTiles" required textarea rows={4} hint="One per line: Label | Value" defaultValue={labelValueItemsToTextarea(values.contactTiles)} />
                    <div className="grid gap-5 md:grid-cols-2">
                        <FormField label="Final CTA kicker" name="finalCtaKicker" required defaultValue={values.finalCtaKicker} />
                        <FormField label="Final CTA heading" name="finalCtaHeading" required defaultValue={values.finalCtaHeading} />
                        <FormField label="Final CTA primary label" name="finalCtaPrimaryLabel" required defaultValue={values.finalCtaPrimaryLabel} />
                        <FormField label="Final CTA primary href" name="finalCtaPrimaryHref" required defaultValue={values.finalCtaPrimaryHref} />
                        <FormField label="Final CTA secondary label" name="finalCtaSecondaryLabel" required defaultValue={values.finalCtaSecondaryLabel} />
                        <FormField label="Final CTA secondary href" name="finalCtaSecondaryHref" required defaultValue={values.finalCtaSecondaryHref} />
                    </div>
                    <FormField label="Final CTA body" name="finalCtaBody" required textarea rows={3} defaultValue={values.finalCtaBody} />
                </AdminSection>

                <div className="flex justify-end">
                    <button className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200">
                        Save homepage
                    </button>
                </div>
            </form>
        </div>
    );
}

function AdminSection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="space-y-5 rounded-lg border border-white/10 bg-slate-950/40 p-5">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <div className="space-y-5">{children}</div>
        </section>
    );
}
