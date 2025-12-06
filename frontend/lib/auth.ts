import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { securityConfig } from './config';

const JWT_SECRET = securityConfig.jwtSecret;
const JWT_EXPIRES_IN = '7d';

export interface JWTPayload {
    userId: number;
    username: string;
    email: string;
    role: string;
}

// Warn in production if using default secret
if (process.env.NODE_ENV === 'production' && JWT_SECRET.includes('change-in-production')) {
    console.error('⚠️  CRITICAL: Using default JWT_SECRET in production is a security risk!');
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

/**
 * Compare a plain text password with a hashed password
 */
export async function comparePassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate a JWT token
 */
export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
        return null;
    }
}
