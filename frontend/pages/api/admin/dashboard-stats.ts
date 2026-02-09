import type { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const [
            projects,
            skills,
            experience,
            education,
            blogPosts,
            publishedBlogPosts,
            testimonials,
            certifications,
            totalContacts,
            unreadContacts,
            recentSubmissions,
        ] = await Promise.all([
            prisma.project.count(),
            prisma.skill.count(),
            prisma.experience.count(),
            prisma.education.count(),
            prisma.blogPost.count(),
            prisma.blogPost.count({ where: { published: true } }),
            prisma.testimonial.count(),
            prisma.certification.count(),
            prisma.contactSubmission.count(),
            prisma.contactSubmission.count({ where: { read: false } }),
            prisma.contactSubmission.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' }
            }),
        ]);

        return res.status(200).json({
            projects,
            skills,
            experience,
            education,
            blogPosts,
            publishedBlogPosts,
            testimonials,
            certifications,
            contactSubmissions: {
                total: totalContacts,
                unread: unreadContacts,
            },
            recentSubmissions,
        });
    } catch (error) {
        console.error('Dashboard stats API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default withAuth(handler);
