export type MediaUploadMode = 'image' | 'pdf';

export interface UploadedMediaAsset {
    id: number;
    url: string;
    key: string | null;
    fileName: string;
    mimeType: string;
    fileSize: number;
}

export interface MediaUploadResponse {
    mediaAsset: UploadedMediaAsset;
}

export interface MediaUploadFileLike {
    name: string;
    type: string;
    size: number;
}

type UploadConfig = {
    accept: string;
    allowedMimeTypes: readonly string[];
    maxBytes: number;
    label: string;
    extension: string;
};

const uploadConfig: Record<MediaUploadMode, UploadConfig> = {
    image: {
        accept: '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp',
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        maxBytes: 5 * 1024 * 1024,
        label: 'image',
        extension: 'jpg',
    },
    pdf: {
        accept: '.pdf,application/pdf',
        allowedMimeTypes: ['application/pdf'],
        maxBytes: 10 * 1024 * 1024,
        label: 'PDF document',
        extension: 'pdf',
    },
};

export function isMediaUploadMode(value: unknown): value is MediaUploadMode {
    return value === 'image' || value === 'pdf';
}

export function normalizeMediaUploadMode(value: FormDataEntryValue | null | undefined): MediaUploadMode {
    return typeof value === 'string' && isMediaUploadMode(value) ? value : 'image';
}

export function getMediaUploadConfig(mode: MediaUploadMode): UploadConfig {
    return uploadConfig[mode];
}

export function validateMediaUploadFile(file: MediaUploadFileLike, mode: MediaUploadMode): string | null {
    const config = getMediaUploadConfig(mode);

    if (!config.allowedMimeTypes.includes(file.type)) {
        return mode === 'image'
            ? 'Please upload a JPG, PNG, or WebP image.'
            : 'Please upload a PDF document.';
    }

    if (file.size > config.maxBytes) {
        return mode === 'image'
            ? 'Image files must be 5MB or smaller.'
            : 'PDF files must be 10MB or smaller.';
    }

    return null;
}

function slugifyFileName(input: string) {
    return input
        .toLowerCase()
        .trim()
        .replace(/\.[^.]+$/, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'upload';
}

export function buildMediaUploadPath(file: MediaUploadFileLike, mode: MediaUploadMode) {
    const config = getMediaUploadConfig(mode);
    const uniqueId = globalThis.crypto?.randomUUID?.().replace(/-/g, '').slice(0, 12) ?? `${Date.now()}`;

    return `media/${mode}/${slugifyFileName(file.name)}-${uniqueId}.${config.extension}`;
}

export function formatMediaFileSize(bytes: number | null | undefined) {
    if (bytes === null || bytes === undefined || Number.isNaN(bytes)) {
        return null;
    }

    if (bytes < 1024) {
        return `${bytes} B`;
    }

    const units = ['KB', 'MB', 'GB'];
    let value = bytes / 1024;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex += 1;
    }

    return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}
