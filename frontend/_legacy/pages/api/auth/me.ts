import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import { verifyToken } from '@/lib/auth';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Parse cookies
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;

        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        // Verify token
        const payload = verifyToken(token);
        if (!payload) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        // Return user info
        return res.status(200).json({
            user: {
                id: payload.userId,
                username: payload.username,
                email: payload.email,
                role: payload.role
            }
        });
    } catch (error) {
        console.error('Session check error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
