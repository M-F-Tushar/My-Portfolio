import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

interface FooterData {
    profile: {
        name: string;
        email: string;
    } | null;
    socialLinks: Array<{
        id: number;
        platform: string;
        url: string;
        icon: string;
    }>;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<FooterData | { error: string }>
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const profile = await prisma.profile.findFirst({
            select: {
                name: true,
                email: true,
            }
        });

        const socialLinks = await prisma.socialLink.findMany({
            select: {
                id: true,
                platform: true,
                url: true,
                icon: true,
            }
        });

        return res.status(200).json({
            profile,
            socialLinks,
        });
    } catch (error) {
        console.error('Error fetching footer data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
