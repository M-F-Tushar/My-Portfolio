import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { strictRateLimit } from '@/lib/rateLimit';
import { sendContactNotification } from '@/lib/email';

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
    // Apply strict rate limiting for contact form
    const allowed = await strictRateLimit(req, res);
    if (!allowed) return;
    
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

        // Message length validation
        if (message.length > 5000) {
            return res.status(400).json({ error: 'Message is too long (max 5000 characters)' });
        }

        // Log the submission
        console.log('Contact form submission:', { name, email, message: message.substring(0, 100) + '...' });

        // Send email notification
        const emailResult = await sendContactNotification({ name, email, message });
        
        if (!emailResult.success && process.env.RESEND_API_KEY) {
            // Only fail if email is configured but failed
            console.error('Failed to send contact notification:', emailResult.error);
        }

        return res.status(200).json({
            success: true,
            message: 'Thank you for your message! I will get back to you soon.'
        });
    } catch (error) {
        console.error('Error processing contact form:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
