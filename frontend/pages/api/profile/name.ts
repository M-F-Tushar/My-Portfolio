import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const profile = await prisma.profile.findFirst();
        return res.status(200).json({
            name: profile?.name || 'Portfolio'
        });
    } catch (error) {
        console.error('Error fetching profile name:', error);
        return res.status(200).json({ name: 'Portfolio' });
    }
}
