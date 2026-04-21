import type { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            const submissions = await prisma.contactSubmission.findMany({
                orderBy: { createdAt: 'desc' }
            });
            return res.status(200).json(submissions);
        } else if (req.method === 'PUT') {
            const { id, read } = req.body;
            const submission = await prisma.contactSubmission.update({
                where: { id },
                data: { read }
            });
            return res.status(200).json(submission);
        } else if (req.method === 'DELETE') {
            const { id } = req.body;
            await prisma.contactSubmission.delete({ where: { id } });
            return res.status(200).json({ message: 'Submission deleted' });
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Contact submissions API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default withAuth(handler);
