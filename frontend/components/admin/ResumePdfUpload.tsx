'use client';

import { useEffect, useState } from 'react';
import MediaUpload from '@/components/admin/MediaUpload';
import type { UploadedMediaAsset } from '@/lib/media/upload';

interface ResumePdfUploadProps {
    initialMedia: UploadedMediaAsset | null;
}

export default function ResumePdfUpload({ initialMedia }: ResumePdfUploadProps) {
    const [media, setMedia] = useState<UploadedMediaAsset | null>(initialMedia);

    useEffect(() => {
        setMedia(initialMedia);
    }, [initialMedia]);

    return (
        <div className="space-y-4">
            <input type="hidden" name="mediaId" value={media?.id ?? ''} />
            <MediaUpload
                mode="pdf"
                currentMedia={media}
                label="Resume PDF"
                buttonLabel={media ? 'Replace PDF' : 'Upload PDF'}
                helperText="Upload the active resume PDF. The saved media id will be attached when you submit."
                onChange={setMedia}
            />
        </div>
    );
}
