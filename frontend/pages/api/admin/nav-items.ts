import type { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            const navItems = await prisma.navItem.findMany({
                orderBy: { order: 'asc' }
            });
            return res.status(200).json(navItems);
        } else if (req.method === 'POST') {
            const data = req.body;
            const navItem = await prisma.navItem.create({ data });
            return res.status(201).json(navItem);
        } else if (req.method === 'PUT') {
            const { id, ...data } = req.body;
            const navItem = await prisma.navItem.update({
                where: { id },
                data
            });
            return res.status(200).json(navItem);
        } else if (req.method === 'DELETE') {
            const { id } = req.body;
            await prisma.navItem.delete({ where: { id } });
            return res.status(200).json({ message: 'NavItem deleted' });
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Admin NavItems API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default withAuth(handler);
