import type { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            const testimonials = await prisma.testimonial.findMany({
                orderBy: { order: 'asc' }
            });
            return res.status(200).json(testimonials);
        } else if (req.method === 'POST') {
            const data = req.body;
            const testimonial = await prisma.testimonial.create({ data });
            return res.status(201).json(testimonial);
        } else if (req.method === 'PUT') {
            const { id, ...data } = req.body;
            const testimonial = await prisma.testimonial.update({
                where: { id },
                data
            });
            return res.status(200).json(testimonial);
        } else if (req.method === 'DELETE') {
            const { id } = req.body;
            await prisma.testimonial.delete({ where: { id } });
            return res.status(200).json({ message: 'Testimonial deleted' });
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Testimonials API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default withAuth(handler);
