import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { env } from '@/lib/env';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();
    const baseRoutes = ['', '/projects', '/resume', '/demos'].map((path) => ({
        url: `${env.siteUrl}${path}`,
        lastModified: now,
    }));

    try {
        const projects = await prisma.project.findMany({
            where: { visible: true },
            select: { slug: true, updatedAt: true },
            orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
        });

        return [
            ...baseRoutes,
            ...projects.map((project) => ({
                url: `${env.siteUrl}/projects#${project.slug}`,
                lastModified: project.updatedAt,
            })),
        ];
    } catch {
        return baseRoutes;
    }
}
