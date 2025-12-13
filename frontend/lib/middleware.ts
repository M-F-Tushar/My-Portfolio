import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import { verifyAccessToken, JWTPayload } from './auth';
import { setCSRFCookie, verifyCSRFToken } from './csrf';

export interface AuthenticatedRequest extends NextApiRequest {
    user?: JWTPayload;
}

/**
 * Middleware to protect API routes with authentication and CSRF protection
 * - Verifies JWT token from cookies and attaches user to request
 * - Validates CSRF token for state-changing requests (POST, PUT, DELETE)
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

            // Verify access token (not refresh token)
            const payload = verifyAccessToken(token);
            if (!payload) {
                return res.status(401).json({ error: 'Invalid or expired token' });
            }

            // CSRF protection for state-changing methods
            const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
            if (!safeMethods.includes(req.method || '')) {
                const csrfValid = verifyCSRFToken(req);
                if (!csrfValid) {
                    return res.status(403).json({ error: 'Invalid CSRF token' });
                }
            } else {
                // Set CSRF cookie for GET requests
                setCSRFCookie(res);
            }

            // Attach user to request
            req.user = payload;

            // Call the actual handler
            return handler(req, res);
        } catch (error) {
            // Sanitize error logging
            const isDev = process.env.NODE_ENV === 'development';
            console.error('Auth middleware error:', {
                message: error instanceof Error ? error.message : 'Unknown error',
                ...(isDev && error instanceof Error && { stack: error.stack }),
            });
            return res.status(500).json({ error: 'Internal server error' });
        }
    };
}

/**
 * Middleware for routes that only need authentication (no CSRF)
 * Use this for read-only endpoints if needed
 */
export function withAuthOnly(
    handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
    return async (req: AuthenticatedRequest, res: NextApiResponse) => {
        try {
            const cookies = parse(req.headers.cookie || '');
            const token = cookies.auth_token;

            if (!token) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            const payload = verifyAccessToken(token);
            if (!payload) {
                return res.status(401).json({ error: 'Invalid or expired token' });
            }

            req.user = payload;
            return handler(req, res);
        } catch (error) {
            const isDev = process.env.NODE_ENV === 'development';
            console.error('Auth middleware error:', {
                message: error instanceof Error ? error.message : 'Unknown error',
                ...(isDev && error instanceof Error && { stack: error.stack }),
            });
            return res.status(500).json({ error: 'Internal server error' });
        }
    };
}
