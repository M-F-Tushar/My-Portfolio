import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';
import { isAdminResource } from '@/lib/admin/resources';

interface ResourceRouteContext {
    params: {
        resource: string;
    };
}

export async function GET(_request: Request, { params }: ResourceRouteContext) {
    try {
        await requireAdmin({ redirectToLogin: false });
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { resource } = params;

    if (!isAdminResource(resource)) {
        return NextResponse.json({ error: 'Unknown admin resource.' }, { status: 404 });
    }

    switch (resource) {
        case 'projects':
            return NextResponse.json({
                data: await prisma.project.findMany({
                    orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
                }),
            });
        case 'demos':
            return NextResponse.json({
                data: await prisma.demo.findMany({
                    orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
                }),
            });
        case 'experience':
            return NextResponse.json({
                data: await prisma.experience.findMany({
                    orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
                }),
            });
        case 'education':
            return NextResponse.json({
                data: await prisma.education.findMany({
                    orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
                }),
            });
        case 'certifications':
            return NextResponse.json({
                data: await prisma.certification.findMany({
                    orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
                }),
            });
        case 'achievements':
            return NextResponse.json({
                data: await prisma.achievement.findMany({
                    orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
                }),
            });
        case 'social':
            return NextResponse.json({
                data: await prisma.socialLink.findMany({
                    orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
                }),
            });
        case 'skills':
            return NextResponse.json({
                data: await prisma.skillCategory.findMany({
                    include: {
                        skills: {
                            orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
                        },
                    },
                    orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
                }),
            });
    }
}
