import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';
import {
    buildMediaUploadPath,
    normalizeMediaUploadMode,
    validateMediaUploadFile,
} from '@/lib/media/upload';

export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        try {
            await requireAdmin({ redirectToLogin: false });
        } catch {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const fileEntry = formData.get('file');
        const mode = normalizeMediaUploadMode(formData.get('mode'));

        if (!(fileEntry instanceof File)) {
            return NextResponse.json({ error: 'Please choose a file to upload.' }, { status: 400 });
        }

        const fileError = validateMediaUploadFile(fileEntry, mode);
        if (fileError) {
            return NextResponse.json({ error: fileError }, { status: 400 });
        }

        const token = process.env.BLOB_READ_WRITE_TOKEN;
        if (!token) {
            return NextResponse.json(
                { error: 'BLOB_READ_WRITE_TOKEN is not configured. Uploads are unavailable.' },
                { status: 500 },
            );
        }

        const uploadedBlob = await put(buildMediaUploadPath(fileEntry, mode), fileEntry, {
            access: 'public',
            token,
            contentType: fileEntry.type,
        });

        const mediaAsset = await prisma.mediaAsset.create({
            data: {
                url: uploadedBlob.url,
                key: uploadedBlob.pathname,
                fileName: fileEntry.name,
                mimeType: fileEntry.type,
                fileSize: fileEntry.size,
            },
            select: {
                id: true,
                url: true,
                key: true,
                fileName: true,
                mimeType: true,
                fileSize: true,
            },
        });

        return NextResponse.json({ mediaAsset });
    } catch (error) {
        console.error('Media upload failed:', error);
        const message = error instanceof Error ? error.message : 'Upload failed.';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
