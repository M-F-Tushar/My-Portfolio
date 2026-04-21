import type { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            // Get all projects
            const projects = await prisma.project.findMany({
                orderBy: { createdAt: 'desc' }
            });
            return res.status(200).json(projects);
        } else if (req.method === 'POST') {
            // Create project
            const data = req.body;

            // Generate slug if not provided
            if (!data.slug && data.title) {
                data.slug = data.title
                    .toLowerCase()
                    .trim()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/[\s_-]+/g, '-')
                    .replace(/^-+|-+$/g, '');
            }

            const project = await prisma.project.create({ data });
            return res.status(201).json(project);
        } else if (req.method === 'PUT') {
            // Update project
            const { id, ...data } = req.body;

            // Update slug if title changed and slug not provided (optional logic, usually we keep slug stable)
            // For now, let's trust the admin to provide slug updates if needed

            const project = await prisma.project.update({
                where: { id },
                data
            });
            return res.status(200).json(project);
        } else if (req.method === 'DELETE') {
            // Delete project
            const { id } = req.body;
            await prisma.project.delete({ where: { id } });
            return res.status(200).json({ message: 'Project deleted' });
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Projects API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default withAuth(handler);
