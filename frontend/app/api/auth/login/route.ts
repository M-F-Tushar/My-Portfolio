import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { loginSchema } from '@/lib/validations/auth';
import {
    SESSION_COOKIE,
    SESSION_MAX_AGE_SECONDS,
    signAdminSession,
} from '@/lib/auth/session';

function getCookieSecureFlag() {
    return process.env.NODE_ENV === 'production';
}

function getRequestEmail(body: Record<string, unknown>) {
    if (typeof body.email === 'string') {
        return body.email;
    }

    if (typeof body.username === 'string') {
        return body.username;
    }

    return undefined;
}

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => null);

        if (!body || typeof body !== 'object') {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const parsed = loginSchema.safeParse({
            email: getRequestEmail(body as Record<string, unknown>),
            password: (body as Record<string, unknown>).password,
        });

        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const email = parsed.data.email.trim();
        const admin = await prisma.adminUser.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: 'insensitive',
                },
            },
        });

        if (!admin) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        const passwordValid = await bcrypt.compare(parsed.data.password, admin.passwordHash);

        if (!passwordValid) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        await prisma.adminUser.update({
            where: { id: admin.id },
            data: { lastLoginAt: new Date() },
        });

        const session = await signAdminSession({
            adminId: admin.id,
            email: admin.email,
        });

        const response = NextResponse.json({
            admin: {
                id: admin.id,
                email: admin.email,
            },
            user: {
                id: admin.id,
                username: admin.email,
                email: admin.email,
                role: 'admin',
            },
        });

        response.cookies.set({
            name: SESSION_COOKIE,
            value: session,
            httpOnly: true,
            sameSite: 'lax',
            secure: getCookieSecureFlag(),
            path: '/',
            maxAge: SESSION_MAX_AGE_SECONDS,
        });

        return response;
    } catch (error) {
        console.error('Admin login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
