import type { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            const education = await prisma.education.findMany({
                orderBy: { createdAt: 'desc' }
            });
            return res.status(200).json(education);
        } else if (req.method === 'POST') {
            const data = req.body;
            const edu = await prisma.education.create({ data });
            return res.status(201).json(edu);
        } else if (req.method === 'PUT') {
            const { id, ...data } = req.body;
            const edu = await prisma.education.update({
                where: { id },
                data
            });
            return res.status(200).json(edu);
        } else if (req.method === 'DELETE') {
            const { id } = req.body;
            await prisma.education.delete({ where: { id } });
            return res.status(200).json({ message: 'Education deleted' });
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Education API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default withAuth(handler);
