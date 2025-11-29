import type { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            const skills = await prisma.skill.findMany({
                orderBy: { category: 'asc' }
            });
            return res.status(200).json(skills);
        } else if (req.method === 'POST') {
            const data = req.body;
            const skill = await prisma.skill.create({ data });
            return res.status(201).json(skill);
        } else if (req.method === 'PUT') {
            const { id, ...data } = req.body;
            const skill = await prisma.skill.update({
                where: { id },
                data
            });
            return res.status(200).json(skill);
        } else if (req.method === 'DELETE') {
            const { id } = req.body;
            await prisma.skill.delete({ where: { id } });
            return res.status(200).json({ message: 'Skill deleted' });
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Skills API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default withAuth(handler);
