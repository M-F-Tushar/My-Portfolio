/**
 * CSRF Protection Middleware for Next.js API Routes
 * 
 * Implements Double Submit Cookie pattern for CSRF protection.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { randomBytes, createHmac } from 'crypto';
import { serialize, parse } from 'cookie';
import { securityConfig } from './config';

const CSRF_COOKIE_NAME = '_csrf';
const CSRF_HEADER_NAME = 'x-csrf-token';
const TOKEN_LENGTH = 32;

/**
 * Generate a cryptographically secure random token
 */
function generateToken(): string {
    return randomBytes(TOKEN_LENGTH).toString('hex');
}

/**
 * Create a signed token using HMAC
 */
function signToken(token: string): string {
    const hmac = createHmac('sha256', securityConfig.csrfSecret);
    hmac.update(token);
    return `${token}.${hmac.digest('hex')}`;
}

/**
 * Verify a signed token
 */
function verifySignedToken(signedToken: string): boolean {
    const parts = signedToken.split('.');
    if (parts.length !== 2) return false;

    const [token, signature] = parts;
    const hmac = createHmac('sha256', securityConfig.csrfSecret);
    hmac.update(token);
    const expectedSignature = hmac.digest('hex');

    // Constant-time comparison to prevent timing attacks
    if (signature.length !== expectedSignature.length) return false;

    let result = 0;
    for (let i = 0; i < signature.length; i++) {
        result |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
    }

    return result === 0;
}

/**
 * Set CSRF cookie on response
 */
export function setCSRFCookie(res: NextApiResponse): string {
    const token = generateToken();
    const signedToken = signToken(token);

    const cookie = serialize(CSRF_COOKIE_NAME, signedToken, {
        httpOnly: false, // Needs to be readable by JavaScript
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60, // 1 hour
    });

    res.setHeader('Set-Cookie', cookie);
    return signedToken;
}

/**
 * CSRF protection middleware
 * 
 * For GET/HEAD/OPTIONS requests, it sets the CSRF cookie.
 * For other methods, it validates the CSRF token.
 */
export function csrfProtection(
    handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void
) {
    return async function csrfMiddleware(
        req: NextApiRequest,
        res: NextApiResponse
    ): Promise<void> {
        // Safe methods don't need CSRF protection
        const safeMethods = ['GET', 'HEAD', 'OPTIONS'];

        if (safeMethods.includes(req.method || '')) {
            // Set CSRF cookie for subsequent requests
            setCSRFCookie(res);
            return handler(req, res);
        }

        // For state-changing methods, validate CSRF token
        const cookies = parse(req.headers.cookie || '');
        const cookieToken = cookies[CSRF_COOKIE_NAME];
        const headerToken = req.headers[CSRF_HEADER_NAME] as string;

        // Both tokens must be present
        if (!cookieToken || !headerToken) {
            return res.status(403).json({
                error: 'CSRF token missing',
                code: 'CSRF_MISSING'
            });
        }

        // Tokens must match
        if (cookieToken !== headerToken) {
            return res.status(403).json({
                error: 'CSRF token mismatch',
                code: 'CSRF_INVALID'
            });
        }

        // Verify token signature
        if (!verifySignedToken(cookieToken)) {
            return res.status(403).json({
                error: 'CSRF token invalid',
                code: 'CSRF_INVALID'
            });
        }

        // Token is valid, proceed
        return handler(req, res);
    };
}

/**
 * Verify CSRF token from request (for use in middleware)
 * Returns true if token is valid, false otherwise
 */
export function verifyCSRFToken(req: NextApiRequest): boolean {
    const cookies = parse(req.headers.cookie || '');
    const cookieToken = cookies[CSRF_COOKIE_NAME];
    const headerToken = req.headers[CSRF_HEADER_NAME] as string;

    // Both tokens must be present
    if (!cookieToken || !headerToken) {
        return false;
    }

    // Tokens must match
    if (cookieToken !== headerToken) {
        return false;
    }

    // Verify token signature
    return verifySignedToken(cookieToken);
}

/**
 * Get CSRF token from cookies (for client-side use)
 */
export function getCSRFToken(): string | null {
    if (typeof document === 'undefined') return null;

    const cookies = parse(document.cookie);
    return cookies[CSRF_COOKIE_NAME] || null;
}

/**
 * React hook to get CSRF token
 */
export function useCSRFToken(): { token: string | null; headerName: string } {
    const token = typeof window !== 'undefined' ? getCSRFToken() : null;
    return { token, headerName: CSRF_HEADER_NAME };
}

export default csrfProtection;
