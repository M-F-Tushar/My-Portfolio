/**
 * Dynamic Robots.txt Generator
 * 
 * Generates robots.txt dynamically with correct sitemap URL
 * based on environment configuration.
 * 
 * Access at: /api/robots.txt
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getFullUrl } from '@/lib/config';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const sitemapUrl = getFullUrl('/api/sitemap.xml');

    const robotsTxt = `# Portfolio Robots.txt
# Generated dynamically

User-agent: *
Allow: /

# Disallow admin and API routes
Disallow: /admin
Disallow: /admin/*
Disallow: /api/
Disallow: /api/*

# Allow specific API endpoints for SEO
Allow: /api/sitemap.xml
Allow: /api/robots.txt

# Crawl-delay for politeness
Crawl-delay: 1

# Sitemap location
Sitemap: ${sitemapUrl}
`;

    // Set caching headers (cache for 24 hours)
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    
    return res.status(200).send(robotsTxt);
}
