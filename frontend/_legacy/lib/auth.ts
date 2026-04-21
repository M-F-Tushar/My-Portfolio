import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { securityConfig } from './config';

const JWT_SECRET = securityConfig.jwtSecret;
// Security: Short-lived access tokens (1 day) with refresh token support
const ACCESS_TOKEN_EXPIRES = '1d';
const REFRESH_TOKEN_EXPIRES = '7d';

export interface JWTPayload {
    userId: number;
    username: string;
    email: string;
    role: string;
    type?: 'access' | 'refresh';
}

/**
 * Password validation requirements
 */
export interface PasswordValidation {
    isValid: boolean;
    errors: string[];
}

/**
 * Validate password meets security requirements
 * - Minimum 12 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export function validatePassword(password: string): PasswordValidation {
    const errors: string[] = [];

    if (password.length < 12) {
        errors.push('Password must be at least 12 characters long');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (!/[@$!%*?&^#()_+\-=[\]{}|;':",.<>/\\`~]/.test(password)) {
        errors.push('Password must contain at least one special character (@$!%*?&^#()_+-=[]{} etc.)');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12); // Increased from 10 to 12 rounds for stronger hashing
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
 * Generate an access token (short-lived)
 */
export function generateToken(payload: JWTPayload): string {
    return jwt.sign({ ...payload, type: 'access' }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });
}

/**
 * Generate a refresh token (longer-lived)
 */
export function generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign({ ...payload, type: 'refresh' }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
        return null;
    }
}

/**
 * Verify that token is specifically an access token
 */
export function verifyAccessToken(token: string): JWTPayload | null {
    const payload = verifyToken(token);
    if (payload && payload.type === 'access') {
        return payload;
    }
    return null;
}

/**
 * Verify that token is specifically a refresh token
 */
export function verifyRefreshToken(token: string): JWTPayload | null {
    const payload = verifyToken(token);
    if (payload && payload.type === 'refresh') {
        return payload;
    }
    return null;
}
