import type { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { IncomingMessage } from 'http';
import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: false,
    },
};

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

function parseMultipart(req: IncomingMessage): Promise<{ filename: string; contentType: string; data: Buffer }> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        let totalSize = 0;

        req.on('data', (chunk: Buffer) => {
            totalSize += chunk.length;
            if (totalSize > MAX_FILE_SIZE) {
                reject(new Error('File too large (max 5MB)'));
                return;
            }
            chunks.push(chunk);
        });

        req.on('end', () => {
            const buffer = Buffer.concat(chunks);
            const contentType = req.headers['content-type'] || '';

            if (!contentType.includes('multipart/form-data')) {
                reject(new Error('Expected multipart/form-data'));
                return;
            }

            const boundaryMatch = contentType.match(/boundary=(.+)/);
            if (!boundaryMatch) {
                reject(new Error('No boundary found'));
                return;
            }

            const boundary = boundaryMatch[1];
            const parts = buffer.toString('binary').split(`--${boundary}`);

            for (const part of parts) {
                if (part.includes('filename=')) {
                    const filenameMatch = part.match(/filename="([^"]+)"/);
                    const typeMatch = part.match(/Content-Type:\s*(.+)\r\n/);
                    const filename = filenameMatch ? filenameMatch[1] : 'upload';
                    const fileContentType = typeMatch ? typeMatch[1].trim() : 'application/octet-stream';

                    // Find the start of file data (after double CRLF)
                    const headerEnd = part.indexOf('\r\n\r\n');
                    if (headerEnd === -1) continue;

                    const fileDataStr = part.substring(headerEnd + 4);
                    // Remove trailing \r\n--
                    const cleanData = fileDataStr.replace(/\r\n$/, '');
                    const fileData = Buffer.from(cleanData, 'binary');

                    resolve({ filename, contentType: fileContentType, data: fileData });
                    return;
                }
            }

            reject(new Error('No file found in upload'));
        });

        req.on('error', reject);
    });
}

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Ensure upload directory exists
        if (!fs.existsSync(UPLOAD_DIR)) {
            fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        }

        const { filename, contentType, data } = await parseMultipart(req);

        // Validate file type
        if (!ALLOWED_TYPES.includes(contentType)) {
            return res.status(400).json({ error: `Invalid file type: ${contentType}. Allowed: ${ALLOWED_TYPES.join(', ')}` });
        }

        // Generate unique filename
        const ext = path.extname(filename) || `.${contentType.split('/')[1]}`;
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
        const filePath = path.join(UPLOAD_DIR, uniqueName);

        // Write file
        fs.writeFileSync(filePath, data);

        const url = `/uploads/${uniqueName}`;
        return res.status(200).json({ url });
    } catch (error) {
        console.error('Upload API error:', error);
        const message = error instanceof Error ? error.message : 'Upload failed';
        return res.status(500).json({ error: message });
    }
}

export default withAuth(handler);
