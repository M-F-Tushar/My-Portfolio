import type { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            const blogPosts = await prisma.blogPost.findMany({
                orderBy: { createdAt: 'desc' }
            });
            return res.status(200).json(blogPosts);
        } else if (req.method === 'POST') {
            const { title, excerpt, content, coverImage, tags, published } = req.body;

            // Auto-generate slug from title
            const slug = (req.body.slug || title || '')
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');

            // Calculate read time (avg 200 words per minute)
            const wordCount = (content || '').split(/\s+/).filter(Boolean).length;
            const readTime = Math.max(1, Math.ceil(wordCount / 200));

            const blogPost = await prisma.blogPost.create({
                data: {
                    title,
                    slug,
                    excerpt: excerpt || '',
                    content: content || '',
                    coverImage: coverImage || null,
                    tags: tags || '[]',
                    published: published || false,
                    publishedAt: published ? new Date() : null,
                    readTime,
                }
            });
            return res.status(201).json(blogPost);
        } else if (req.method === 'PUT') {
            const { id, ...data } = req.body;

            // Recalculate read time if content changed
            if (data.content) {
                const wordCount = data.content.split(/\s+/).filter(Boolean).length;
                data.readTime = Math.max(1, Math.ceil(wordCount / 200));
            }

            // Set publishedAt when first published
            if (data.published === true) {
                const existing = await prisma.blogPost.findUnique({ where: { id } });
                if (existing && !existing.publishedAt) {
                    data.publishedAt = new Date();
                }
            }

            const blogPost = await prisma.blogPost.update({
                where: { id },
                data
            });
            return res.status(200).json(blogPost);
        } else if (req.method === 'DELETE') {
            const { id } = req.body;
            await prisma.blogPost.delete({ where: { id } });
            return res.status(200).json({ message: 'Blog post deleted' });
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Blog posts API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default withAuth(handler);
