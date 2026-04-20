import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth/session';

function getCookieSecureFlag() {
    return process.env.NODE_ENV === 'production';
}

export async function POST() {
    const response = NextResponse.json({ success: true });

    response.cookies.set({
        name: SESSION_COOKIE,
        value: '',
        httpOnly: true,
        sameSite: 'lax',
        secure: getCookieSecureFlag(),
        path: '/',
        maxAge: 0,
    });

    return response;
}
