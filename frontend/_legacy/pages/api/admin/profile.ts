import type { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            // Get profile
            const profile = await prisma.profile.findFirst();
            return res.status(200).json(profile);
        } else if (req.method === 'PUT') {
            // Update profile
            const data = req.body;

            // Get the first profile (there should only be one)
            const existingProfile = await prisma.profile.findFirst();

            if (!existingProfile) {
                // Create if doesn't exist
                const profile = await prisma.profile.create({ data });
                return res.status(201).json(profile);
            }

            // Update existing
            const profile = await prisma.profile.update({
                where: { id: existingProfile.id },
                data
            });

            return res.status(200).json(profile);
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Profile API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default withAuth(handler);
