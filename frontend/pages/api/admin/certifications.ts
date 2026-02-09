import type { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            const certifications = await prisma.certification.findMany({
                orderBy: { createdAt: 'desc' }
            });
            return res.status(200).json(certifications);
        } else if (req.method === 'POST') {
            const data = req.body;
            const certification = await prisma.certification.create({ data });
            return res.status(201).json(certification);
        } else if (req.method === 'PUT') {
            const { id, ...data } = req.body;
            const certification = await prisma.certification.update({
                where: { id },
                data
            });
            return res.status(200).json(certification);
        } else if (req.method === 'DELETE') {
            const { id } = req.body;
            await prisma.certification.delete({ where: { id } });
            return res.status(200).json({ message: 'Certification deleted' });
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Certifications API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default withAuth(handler);
