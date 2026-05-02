import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hasDatabaseUrl } from '@/lib/env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    if (!hasDatabaseUrl()) {
        return NextResponse.json({
            status: 'ok',
            database: 'not_configured',
        });
    }

    try {
        await prisma.$queryRaw`SELECT 1`;

        return NextResponse.json({
            status: 'ok',
            database: 'ok',
        });
    } catch (error) {
        console.error('Health check database probe failed:', error);

        return NextResponse.json(
            {
                status: 'degraded',
                database: 'error',
            },
            { status: 503 },
        );
    }
}
