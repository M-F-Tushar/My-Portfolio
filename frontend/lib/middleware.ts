import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import { verifyToken, JWTPayload } from './auth';

export interface AuthenticatedRequest extends NextApiRequest {
    user?: JWTPayload;
}

/**
 * Middleware to protect API routes
 * Verifies JWT token from cookies and attaches user to request
 */
export function withAuth(
    handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
    return async (req: AuthenticatedRequest, res: NextApiResponse) => {
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

            // Attach user to request
            req.user = payload;

            // Call the actual handler
            return handler(req, res);
        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    };
}
