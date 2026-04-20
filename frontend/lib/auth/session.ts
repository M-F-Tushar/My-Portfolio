import { SignJWT, jwtVerify } from 'jose';
import { env } from '@/lib/env';

export const SESSION_COOKIE = 'portfolio_admin_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const textEncoder = new TextEncoder();

export interface AdminSession {
    adminId: number;
    email: string;
}

function getSecretKey() {
    return textEncoder.encode(env.jwtSecret);
}

async function readSessionCookieFromNextHeaders() {
    const { cookies } = await import('next/headers');
    return cookies().get(SESSION_COOKIE)?.value ?? null;
}

export async function signAdminSession(session: AdminSession): Promise<string> {
    return new SignJWT({
        adminId: session.adminId,
        email: session.email,
    })
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setIssuedAt()
        .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
        .sign(getSecretKey());
}

export async function verifyAdminSession(token: string): Promise<AdminSession | null> {
    try {
        const { payload } = await jwtVerify(token, getSecretKey(), {
            algorithms: ['HS256'],
        });

        const adminId = typeof payload.adminId === 'number'
            ? payload.adminId
            : typeof payload.adminId === 'string'
                ? Number(payload.adminId)
                : Number.NaN;

        const email = typeof payload.email === 'string' ? payload.email : '';

        if (!Number.isInteger(adminId) || adminId <= 0 || !email) {
            return null;
        }

        return { adminId, email };
    } catch {
        return null;
    }
}

export async function getCurrentAdmin(sessionToken?: string): Promise<AdminSession | null> {
    const token = sessionToken ?? await readSessionCookieFromNextHeaders();

    if (!token) {
        return null;
    }

    return verifyAdminSession(token);
}

export async function requireAdmin(): Promise<AdminSession> {
    const session = await getCurrentAdmin();

    if (!session) {
        throw new Error('Unauthorized');
    }

    return session;
}
