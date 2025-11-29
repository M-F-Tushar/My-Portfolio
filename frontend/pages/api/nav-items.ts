import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const navItems = await prisma.navItem.findMany({
            where: { visible: true },
            orderBy: { order: 'asc' },
        });
        return res.status(200).json(navItems);
    } catch (error) {
        console.error('NavItems API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
