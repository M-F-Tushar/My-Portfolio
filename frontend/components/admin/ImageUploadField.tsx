'use client';

import { useEffect, useState } from 'react';
import MediaUpload from '@/components/admin/MediaUpload';
import type { UploadedMediaAsset } from '@/lib/media/upload';

interface ImageUploadFieldProps {
    fieldName: string;
    initialMedia: UploadedMediaAsset | null;
    label: string;
    helperText?: string;
}

export default function ImageUploadField({
    fieldName,
    initialMedia,
    label,
    helperText,
}: ImageUploadFieldProps) {
    const [media, setMedia] = useState<UploadedMediaAsset | null>(initialMedia);

    useEffect(() => {
        setMedia(initialMedia);
    }, [initialMedia]);

    return (
        <div className="space-y-4">
            <input type="hidden" name={fieldName} value={media?.id ?? ''} />
            <MediaUpload
                mode="image"
                currentMedia={media}
                label={label}
                buttonLabel={media ? 'Replace image' : 'Upload image'}
                helperText={helperText ?? 'Upload an image, then save this form to publish it.'}
                onChange={setMedia}
            />
        </div>
    );
}
