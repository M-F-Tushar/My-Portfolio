/**
 * Structured Data (JSON-LD) Generator
 * 
 * Generates structured data for SEO.
 */

import { siteConfig, getFullUrl, getImageUrl } from './config';

interface PersonData {
    name: string;
    jobTitle: string;
    description: string;
    email?: string;
    image?: string;
    url?: string;
    sameAs?: string[];
    knowsAbout?: string[];
}

interface ArticleData {
    title: string;
    description: string;
    image?: string;
    datePublished: string;
    dateModified?: string;
    author: string;
    url: string;
}

interface BreadcrumbItem {
    name: string;
    url: string;
}

interface ProjectData {
    name: string;
    description: string;
    url: string;
    image?: string;
    dateCreated?: string;
    technologies?: string[];
    repositoryUrl?: string;
}

/**
 * Generate Person schema for portfolio owner
 */
export function generatePersonSchema(data: PersonData): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: data.name,
        jobTitle: data.jobTitle,
        description: data.description,
        email: data.email ? `mailto:${data.email}` : undefined,
        image: data.image ? getImageUrl(data.image) : undefined,
        url: data.url || getFullUrl('/'),
        sameAs: data.sameAs || [],
        knowsAbout: data.knowsAbout || [],
    };
}

/**
 * Generate Article schema for blog posts
 */
export function generateArticleSchema(data: ArticleData): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data.title,
        description: data.description,
        image: data.image ? getImageUrl(data.image) : undefined,
        datePublished: data.datePublished,
        dateModified: data.dateModified || data.datePublished,
        author: {
            '@type': 'Person',
            name: data.author,
            url: getFullUrl('/'),
        },
        publisher: {
            '@type': 'Person',
            name: siteConfig.author,
            url: getFullUrl('/'),
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': data.url,
        },
    };
}

/**
 * Generate BreadcrumbList schema for navigation
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: getFullUrl(item.url),
        })),
    };
}

/**
 * Generate SoftwareSourceCode schema for projects
 */
export function generateProjectSchema(data: ProjectData): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: data.name,
        description: data.description,
        url: data.url,
        image: data.image ? getImageUrl(data.image) : undefined,
        dateCreated: data.dateCreated,
        programmingLanguage: data.technologies || [],
        codeRepository: data.repositoryUrl,
        author: {
            '@type': 'Person',
            name: siteConfig.author,
            url: getFullUrl('/'),
        },
    };
}

/**
 * Generate WebSite schema
 */
export function generateWebSiteSchema(): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteConfig.name,
        description: siteConfig.defaultDescription,
        url: getFullUrl('/'),
        author: {
            '@type': 'Person',
            name: siteConfig.author,
        },
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${getFullUrl('/projects')}?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };
}

/**
 * Combine multiple schemas into a single script tag content
 */
export function combineSchemas(...schemas: object[]): string {
    if (schemas.length === 1) {
        return JSON.stringify(schemas[0]);
    }
    return JSON.stringify(schemas);
}

export default {
    generatePersonSchema,
    generateArticleSchema,
    generateBreadcrumbSchema,
    generateProjectSchema,
    generateWebSiteSchema,
    combineSchemas,
};
