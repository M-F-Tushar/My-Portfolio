import type { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            const socialLinks = await prisma.socialLink.findMany({
                orderBy: { createdAt: 'asc' }
            });
            return res.status(200).json(socialLinks);
        } else if (req.method === 'POST') {
            const data = req.body;
            const link = await prisma.socialLink.create({ data });
            return res.status(201).json(link);
        } else if (req.method === 'PUT') {
            const { id, ...data } = req.body;
            const link = await prisma.socialLink.update({
                where: { id },
                data
            });
            return res.status(200).json(link);
        } else if (req.method === 'DELETE') {
            const { id } = req.body;
            await prisma.socialLink.delete({ where: { id } });
            return res.status(200).json({ message: 'Social link deleted' });
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Social links API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default withAuth(handler);
