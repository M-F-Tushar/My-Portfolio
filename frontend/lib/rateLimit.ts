/**
 * Rate Limiting Middleware for Next.js API Routes
 * 
 * Implements a simple in-memory rate limiter using a sliding window approach.
 * For production, consider using Redis-based rate limiting.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { securityConfig } from './config';

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

// In-memory store (use Redis in production for distributed systems)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetTime < now) {
            rateLimitStore.delete(key);
        }
    }
}, 60000); // Clean up every minute

export interface RateLimitConfig {
    windowMs?: number;
    maxRequests?: number;
    keyGenerator?: (req: NextApiRequest) => string;
    message?: string;
}

/**
 * Get client IP address from request
 */
function getClientIP(req: NextApiRequest): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
        return forwarded.split(',')[0].trim();
    }
    if (Array.isArray(forwarded)) {
        return forwarded[0];
    }
    return req.socket?.remoteAddress || 'unknown';
}

/**
 * Rate limit middleware for API routes
 */
export function rateLimit(config: RateLimitConfig = {}) {
    const {
        windowMs = securityConfig.rateLimit.windowMs,
        maxRequests = securityConfig.rateLimit.maxRequests,
        keyGenerator = (req) => getClientIP(req),
        message = 'Too many requests, please try again later.',
    } = config;

    return async function rateLimitMiddleware(
        req: NextApiRequest,
        res: NextApiResponse
    ): Promise<boolean> {
        const key = keyGenerator(req);
        const now = Date.now();
        
        let entry = rateLimitStore.get(key);
        
        if (!entry || entry.resetTime < now) {
            // Create new entry or reset expired one
            entry = {
                count: 1,
                resetTime: now + windowMs,
            };
            rateLimitStore.set(key, entry);
        } else {
            entry.count++;
        }

        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', maxRequests);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - entry.count));
        res.setHeader('X-RateLimit-Reset', Math.ceil(entry.resetTime / 1000));

        if (entry.count > maxRequests) {
            res.setHeader('Retry-After', Math.ceil((entry.resetTime - now) / 1000));
            res.status(429).json({ error: message });
            return false;
        }

        return true;
    };
}

/**
 * Stricter rate limit for sensitive endpoints (login, contact form)
 */
export const strictRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
    message: 'Too many attempts. Please try again in 15 minutes.',
});

/**
 * Standard rate limit for general API endpoints
 */
export const standardRateLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
});

/**
 * Higher limit for public read endpoints
 */
export const readOnlyRateLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 120, // 120 requests per minute
});

export default rateLimit;
