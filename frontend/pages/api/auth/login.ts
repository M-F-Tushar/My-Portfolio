import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { comparePassword, generateToken } from '@/lib/auth';
import { serialize } from 'cookie';
import { strictRateLimit } from '@/lib/rateLimit';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Apply strict rate limiting for login attempts
    const allowed = await strictRateLimit(req, res);
    if (!allowed) return;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        });

        // Set HTTP-only cookie with 1-day expiry (matches JWT access token expiry)
        const cookie = serialize('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day (reduced from 7 days for security)
            path: '/'
        });

        res.setHeader('Set-Cookie', cookie);

        // Return user info (without password)
        return res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        // Sanitize error logging - never log sensitive details in production
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const isDev = process.env.NODE_ENV === 'development';

        console.error('Login error:', {
            message: errorMessage,
            timestamp: new Date().toISOString(),
            // Only include stack trace in development
            ...(isDev && error instanceof Error && { stack: error.stack }),
        });

        return res.status(500).json({ error: 'Internal server error' });
    }
}
