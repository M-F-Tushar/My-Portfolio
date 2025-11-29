import type { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            const experience = await prisma.experience.findMany({
                orderBy: { createdAt: 'desc' }
            });
            return res.status(200).json(experience);
        } else if (req.method === 'POST') {
            const data = req.body;
            const exp = await prisma.experience.create({ data });
            return res.status(201).json(exp);
        } else if (req.method === 'PUT') {
            const { id, ...data } = req.body;
            const exp = await prisma.experience.update({
                where: { id },
                data
            });
            return res.status(200).json(exp);
        } else if (req.method === 'DELETE') {
            const { id } = req.body;
            await prisma.experience.delete({ where: { id } });
            return res.status(200).json({ message: 'Experience deleted' });
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Experience API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default withAuth(handler);
