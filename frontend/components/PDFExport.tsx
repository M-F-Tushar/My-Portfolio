/**
 * PDF Portfolio Export
 * Print-friendly portfolio view and PDF generation utilities
 */
import React, { useRef } from 'react';

interface PortfolioData {
    name: string;
    title: string;
    email: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
    summary: string;
    skills: Array<{
        category: string;
        items: string[];
    }>;
    experience: Array<{
        company: string;
        role: string;
        duration: string;
        description: string;
        highlights?: string[];
    }>;
    education: Array<{
        institution: string;
        degree: string;
        year: string;
        gpa?: string;
    }>;
    projects: Array<{
        name: string;
        description: string;
        technologies: string[];
        link?: string;
    }>;
    certifications?: Array<{
        name: string;
        issuer: string;
        date: string;
    }>;
}

interface PDFExportProps {
    data: PortfolioData;
    className?: string;
}

/**
 * Print-friendly Portfolio View
 */
export function PrintablePortfolio({ data, className = '' }: PDFExportProps) {
    return (
        <div
            className={`print-portfolio bg-white text-gray-900 max-w-4xl mx-auto ${className}`}
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
            {/* Header */}
            <header className="mb-6 pb-4 border-b-2 border-gray-300">
                <h1 className="text-3xl font-bold mb-1">{data.name}</h1>
                <h2 className="text-xl text-gray-600 mb-3">{data.title}</h2>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {data.email && (
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {data.email}
                        </span>
                    )}
                    {data.phone && (
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {data.phone}
                        </span>
                    )}
                    {data.location && (
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {data.location}
                        </span>
                    )}
                    {data.website && (
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            {data.website}
                        </span>
                    )}
                    {data.linkedin && (
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                            LinkedIn
                        </span>
                    )}
                    {data.github && (
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                            </svg>
                            GitHub
                        </span>
                    )}
                </div>
            </header>

            {/* Summary */}
            <section className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 uppercase tracking-wide">
                    Professional Summary
                </h3>
                <p className="text-sm leading-relaxed">{data.summary}</p>
            </section>

            {/* Skills */}
            <section className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 uppercase tracking-wide">
                    Technical Skills
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    {data.skills.map((skillGroup, idx) => (
                        <div key={idx} className="text-sm">
                            <span className="font-medium">{skillGroup.category}:</span>{' '}
                            <span className="text-gray-600">{skillGroup.items.join(', ')}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Experience */}
            <section className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 uppercase tracking-wide">
                    Professional Experience
                </h3>
                {data.experience.map((exp, idx) => (
                    <div key={idx} className="mb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-semibold">{exp.role}</h4>
                                <p className="text-sm text-gray-600">{exp.company}</p>
                            </div>
                            <span className="text-sm text-gray-500">{exp.duration}</span>
                        </div>
                        <p className="text-sm mt-1">{exp.description}</p>
                        {exp.highlights && (
                            <ul className="list-disc list-inside text-sm mt-1 text-gray-600">
                                {exp.highlights.map((h, i) => (
                                    <li key={i}>{h}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </section>

            {/* Projects */}
            <section className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 uppercase tracking-wide">
                    Featured Projects
                </h3>
                {data.projects.map((project, idx) => (
                    <div key={idx} className="mb-3">
                        <h4 className="font-semibold">
                            {project.name}
                            {project.link && (
                                <span className="text-sm font-normal text-gray-500 ml-2">
                                    ({project.link})
                                </span>
                            )}
                        </h4>
                        <p className="text-sm">{project.description}</p>
                        <p className="text-sm text-gray-500 mt-1">
                            <span className="font-medium">Technologies:</span>{' '}
                            {project.technologies.join(', ')}
                        </p>
                    </div>
                ))}
            </section>

            {/* Education */}
            <section className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 uppercase tracking-wide">
                    Education
                </h3>
                {data.education.map((edu, idx) => (
                    <div key={idx} className="mb-2 flex justify-between">
                        <div>
                            <h4 className="font-semibold">{edu.degree}</h4>
                            <p className="text-sm text-gray-600">{edu.institution}</p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                            <span>{edu.year}</span>
                            {edu.gpa && <span className="block">GPA: {edu.gpa}</span>}
                        </div>
                    </div>
                ))}
            </section>

            {/* Certifications */}
            {data.certifications && data.certifications.length > 0 && (
                <section className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 uppercase tracking-wide">
                        Certifications
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        {data.certifications.map((cert, idx) => (
                            <div key={idx} className="text-sm">
                                <span className="font-medium">{cert.name}</span>
                                <span className="text-gray-500"> - {cert.issuer} ({cert.date})</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

/**
 * PDF Download Button Component
 */
export function PDFDownloadButton({
    data,
    filename = 'portfolio.pdf',
    className = '',
    children,
}: {
    data: PortfolioData;
    filename?: string;
    className?: string;
    children?: React.ReactNode;
}) {
    const contentRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        // Open print dialog for PDF
        window.print();
    };

    return (
        <>
            <button
                onClick={handlePrint}
                className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium ${className}`}
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {children || 'Download PDF'}
            </button>

            {/* Hidden printable content */}
            <div className="hidden print:block" ref={contentRef}>
                <PrintablePortfolio data={data} />
            </div>
        </>
    );
}

/**
 * Print styles that need to be added to globals.css or as a style tag
 */
export const printStyles = `
@media print {
    /* Hide non-printable elements */
    nav, footer, .no-print, button, .print\\:hidden {
        display: none !important;
    }

    /* Show printable elements */
    .print\\:block {
        display: block !important;
    }

    /* Reset page styles */
    body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
    }

    /* Page setup */
    @page {
        size: A4;
        margin: 1cm;
    }

    /* Ensure content fits */
    .print-portfolio {
        width: 100%;
        max-width: none;
        padding: 0;
        font-size: 10pt;
    }

    /* Avoid page breaks inside elements */
    section {
        page-break-inside: avoid;
    }

    /* Links show URL */
    a[href]:after {
        content: " (" attr(href) ")";
        font-size: 0.8em;
        color: #666;
    }
}
`;

export default PrintablePortfolio;
