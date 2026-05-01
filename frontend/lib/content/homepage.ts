export const homepageContentDefaults = {
    heroStatus: 'Available for AI/ML opportunities',
    heroMetricOneValue: 'CS',
    heroMetricOneLabel: 'Undergraduate',
    heroMetricTwoValue: 'AI/ML',
    heroMetricTwoLabel: 'Engineering path',
    heroOrbitSignals: JSON.stringify(['RAG', 'Tokens', 'Vectors', 'Eval', 'MLOps']),
    heroWorkflowStages: JSON.stringify([
        { label: 'Prompt', detail: 'User goal + context' },
        { label: 'Retrieval', detail: 'Docs / data / memory' },
        { label: 'Model', detail: 'LLM or ML pipeline' },
        { label: 'Eval', detail: 'Quality + reliability' },
    ]),
    heroOutputTags: JSON.stringify(['RAG', 'Evaluation', 'MLOps', 'Deployment']),
    aboutKicker: 'About',
    aboutHeading: 'Applied AI/ML systems with a computer science foundation.',
    aboutBody:
        'The portfolio is arranged around employer-readable evidence: technical direction, project cards, stack visibility, resume access, and a private contact workflow.',
    aboutScanTags: JSON.stringify(['LLM Apps', 'ML Systems', 'Python', 'RAG', 'Evaluation', 'MLOps']),
    candidateSignals: JSON.stringify([
        { label: 'Direction', value: 'AI Engineering' },
        { label: 'Strength', value: 'ML Systems' },
        { label: 'Production focus', value: 'MLOps' },
        { label: 'Output', value: 'Projects + Resume' },
    ]),
    skillsKicker: 'Capabilities',
    skillsHeading: 'Technical Stack',
    skillsSummary: 'LLMs / ML / MLOps / Python',
    projectsKicker: 'Selected Work',
    projectsHeading: 'Projects',
    projectsLinkLabel: 'View all projects',
    projectsPageKicker: 'Projects',
    projectsPageHeading: 'Projects',
    projectsPageSummary: 'AI/ML builds / stack / links / status',
    demosPageKicker: 'Demos',
    demosPageHeading: 'Live demos appear here once they are enabled and ready.',
    demosPageSummary: 'This page only surfaces public demo records that have been marked visible and published from the CMS.',
    resumePageKicker: 'Resume',
    processKicker: 'Process',
    processHeading: 'How I build proof.',
    processSummary: 'Scope / build / evaluate / publish',
    processSteps: JSON.stringify([
        { label: 'Scope', detail: 'Define the role signal, project goal, and measurable outcome.' },
        { label: 'Build', detail: 'Ship the smallest working AI/ML system with clean engineering habits.' },
        { label: 'Evaluate', detail: 'Review outputs, data flow, reliability, and deployment readiness.' },
        { label: 'Publish', detail: 'Turn the work into a project card, resume point, and case-study link.' },
    ]),
    experienceKicker: 'Background',
    experienceHeading: 'Experience',
    experienceSummary: 'Timeline / projects / applied systems',
    educationKicker: 'Education',
    educationHeading: 'CS foundation and AI/ML focus.',
    educationSummary: 'Coursework / credentials / portfolio evidence',
    achievementsKicker: 'Achievements',
    achievementsHeading: 'Achievements and hackathons.',
    contactKicker: 'Contact',
    contactHeading: 'Start a conversation.',
    contactBody: 'Open to internships, research, and AI project work. Messages are saved privately for review.',
    contactTiles: JSON.stringify([
        { label: 'Availability', value: 'Internship' },
        { label: 'Direction', value: 'AI/ML' },
        { label: 'Response', value: 'Private inbox' },
    ]),
    finalCtaKicker: 'Next Step',
    finalCtaHeading: 'Ready to review AI/ML project evidence?',
    finalCtaBody: 'Explore projects, preview the resume, or send a direct message.',
    finalCtaPrimaryLabel: 'View Projects',
    finalCtaPrimaryHref: '/projects',
    finalCtaSecondaryLabel: 'Preview Resume',
    finalCtaSecondaryHref: '/resume',
};

export type LabelValueItem = {
    label: string;
    value: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

export function parseLabelValueItems(value: string | null | undefined, fallback: LabelValueItem[]) {
    if (!value) {
        return fallback;
    }

    try {
        const parsed = JSON.parse(value);

        if (!Array.isArray(parsed)) {
            return fallback;
        }

        const items = parsed
            .filter(isRecord)
            .map((item) => ({
                label: typeof item.label === 'string' ? item.label.trim() : '',
                value:
                    typeof item.value === 'string'
                        ? item.value.trim()
                        : typeof item.detail === 'string'
                          ? item.detail.trim()
                          : '',
            }))
            .filter((item) => item.label && item.value);

        return items.length ? items : fallback;
    } catch {
        return fallback;
    }
}

export function labelValueItemsToTextarea(value: string | null | undefined) {
    return parseLabelValueItems(value, []).map((item) => `${item.label} | ${item.value}`).join('\n');
}

export function labelValueTextareaToJson(value: string | null | undefined) {
    const items = (value ?? '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const [label, ...valueParts] = line.split('|');
            return {
                label: label?.trim() ?? '',
                value: valueParts.join('|').trim(),
            };
        })
        .filter((item) => item.label && item.value);

    return JSON.stringify(items);
}
