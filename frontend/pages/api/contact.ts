import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

interface ContactSubmission {
    id: number;
    name: string;
    email: string;
    message: string;
    createdAt: Date;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ success: boolean; message: string } | { error: string }>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, message }: ContactFormData = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Check if ContactSubmission table exists, if not we'll just return success
        // In a real implementation, you'd want to add this model to your Prisma schema
        try {
            // Store in database (you'll need to add this model to schema.prisma)
            // const submission = await prisma.contactSubmission.create({
            //     data: { name, email, message }
            // });

            // For now, just log it
            console.log('Contact form submission:', { name, email, message });

            // In production, you would:
            // 1. Send an email notification
            // 2. Store in database
            // 3. Send auto-reply to user

            return res.status(200).json({
                success: true,
                message: 'Thank you for your message! I will get back to you soon.'
            });
        } catch (dbError) {
            // If database operation fails, still log and return success
            console.log('Contact form submission (DB unavailable):', { name, email, message });
            return res.status(200).json({
                success: true,
                message: 'Thank you for your message! I will get back to you soon.'
            });
        }
    } catch (error) {
        console.error('Error processing contact form:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
