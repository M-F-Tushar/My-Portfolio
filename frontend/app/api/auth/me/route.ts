import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth/session';

export async function GET() {
    const admin = await getCurrentAdmin();

    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
        admin: {
            id: admin.adminId,
            email: admin.email,
        },
        user: {
            id: admin.adminId,
            username: admin.email,
            email: admin.email,
            role: 'admin',
        },
    });
}
