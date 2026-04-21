'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { FileImage, FileText, Loader2, Upload } from 'lucide-react';
import {
    getMediaUploadConfig,
    type MediaUploadMode,
    type MediaUploadResponse,
    type UploadedMediaAsset,
    validateMediaUploadFile,
    formatMediaFileSize,
} from '@/lib/media/upload';

interface MediaUploadProps {
    mode: MediaUploadMode;
    currentMedia?: UploadedMediaAsset | null;
    label?: string;
    buttonLabel?: string;
    helperText?: string;
    onChange: (media: UploadedMediaAsset | null) => void;
}

async function readUploadError(response: Response) {
    try {
        const payload = await response.json();
        return typeof payload?.error === 'string' ? payload.error : 'Upload failed.';
    } catch {
        return 'Upload failed.';
    }
}

export default function MediaUpload({
    mode,
    currentMedia = null,
    label,
    buttonLabel,
    helperText,
    onChange,
}: MediaUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const config = getMediaUploadConfig(mode);
    const accept = config.accept;
    const currentSize = formatMediaFileSize(currentMedia?.fileSize ?? null);
    const fileIcon = mode === 'image' ? FileImage : FileText;
    const Icon = fileIcon;

    const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const fileError = validateMediaUploadFile(file, mode);
        if (fileError) {
            setError(fileError);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('mode', mode);
            formData.append('file', file);

            const response = await fetch('/api/media/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                setError(await readUploadError(response));
                return;
            }

            const payload = (await response.json()) as MediaUploadResponse;
            onChange(payload.mediaAsset);
        } catch (uploadError) {
            setError(uploadError instanceof Error ? uploadError.message : 'Upload failed.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="space-y-4 rounded-lg border border-white/10 bg-slate-950/60 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                    {label ? <p className="text-sm font-semibold text-white">{label}</p> : null}
                    <p className="text-xs leading-5 text-slate-400">
                        {helperText ?? `Upload a ${config.label} to replace the active file.`}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {buttonLabel ?? `Upload ${mode === 'pdf' ? 'PDF' : 'image'}`}
                </button>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleUpload}
                className="hidden"
            />

            {currentMedia ? (
                <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-slate-900 text-cyan-200">
                        <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">{currentMedia.fileName}</p>
                        <p className="text-xs text-slate-400">
                            {currentMedia.mimeType}
                            {currentSize ? ` • ${currentSize}` : ''}
                        </p>
                    </div>
                    <a
                        href={currentMedia.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:bg-white/5"
                    >
                        Open
                    </a>
                </div>
            ) : (
                <div className="rounded-lg border border-dashed border-white/10 bg-white/[0.02] p-3 text-sm text-slate-400">
                    No file is linked yet.
                </div>
            )}

            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        </div>
    );
}
