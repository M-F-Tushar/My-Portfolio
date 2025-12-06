/**
 * Dynamic Sitemap Generator
 * 
 * Generates a sitemap.xml dynamically based on:
 * - Static pages
 * - Project pages from database
 * 
 * Access at: /api/sitemap.xml
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { siteConfig, getFullUrl } from '@/lib/config';

interface SitemapUrl {
    loc: string;
    lastmod?: string;
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
}

// Static pages configuration
const staticPages: SitemapUrl[] = [
    {
        loc: '/',
        changefreq: 'weekly',
        priority: 1.0,
    },
    {
        loc: '/chat',
        changefreq: 'monthly',
        priority: 0.8,
    },
    {
        loc: '/agent',
        changefreq: 'monthly',
        priority: 0.8,
    },
];

/**
 * Generate XML for a single URL entry
 */
function generateUrlEntry(url: SitemapUrl): string {
    const fullUrl = getFullUrl(url.loc);
    
    let xml = `  <url>\n    <loc>${escapeXml(fullUrl)}</loc>\n`;
    
    if (url.lastmod) {
        xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    }
    
    if (url.changefreq) {
        xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    }
    
    if (url.priority !== undefined) {
        xml += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
    }
    
    xml += '  </url>';
    
    return xml;
}

/**
 * Escape special XML characters
 */
function escapeXml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const currentDate = new Date().toISOString().split('T')[0];
        
        // Add lastmod to static pages
        const pages: SitemapUrl[] = staticPages.map(page => ({
            ...page,
            lastmod: currentDate,
        }));

        // Fetch projects from database (all projects are considered published)
        try {
            const projects = await prisma.project.findMany({
                select: {
                    slug: true,
                    updatedAt: true,
                },
                orderBy: { updatedAt: 'desc' },
            });

            // Add project pages
            for (const project of projects) {
                pages.push({
                    loc: `/projects/${project.slug}`,
                    lastmod: project.updatedAt.toISOString().split('T')[0],
                    changefreq: 'monthly',
                    priority: 0.7,
                });
            }
        } catch (dbError) {
            // Database might not be available, continue with static pages
            console.warn('Database unavailable for sitemap generation:', dbError);
        }

        // Generate sitemap XML
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${pages.map(generateUrlEntry).join('\n')}
</urlset>`;

        // Set caching headers (cache for 1 hour, revalidate in background)
        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
        
        return res.status(200).send(sitemap);
    } catch (error) {
        console.error('Error generating sitemap:', error);
        return res.status(500).json({ error: 'Failed to generate sitemap' });
    }
}
