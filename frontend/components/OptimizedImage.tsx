/**
 * Optimized Image Component
 * Wrapper around Next.js Image with blur placeholder and lazy loading
 */
import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    priority?: boolean;
    className?: string;
    containerClassName?: string;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    quality?: number;
    sizes?: string;
    blurDataURL?: string;
}

// Default blur placeholder SVG (shimmer effect)
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f3f4f6" offset="20%" />
      <stop stop-color="#e5e7eb" offset="50%" />
      <stop stop-color="#f3f4f6" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f3f4f6" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
    typeof window === 'undefined'
        ? Buffer.from(str).toString('base64')
        : window.btoa(str);

export function OptimizedImage({
    src,
    alt,
    width,
    height,
    fill = false,
    priority = false,
    className = '',
    containerClassName = '',
    objectFit = 'cover',
    quality = 75,
    sizes,
    blurDataURL,
}: OptimizedImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Generate default blur placeholder
    const defaultBlur = blurDataURL || 
        `data:image/svg+xml;base64,${toBase64(shimmer(width || 700, height || 475))}`;

    // Fallback image for errors
    const fallbackImage = `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="${width || 400}" height="${height || 300}" viewBox="0 0 400 300">
            <rect fill="#f3f4f6" width="400" height="300"/>
            <text fill="#9ca3af" font-family="sans-serif" font-size="14" x="50%" y="50%" text-anchor="middle" dominant-baseline="middle">
                Image unavailable
            </text>
        </svg>
    `)}`;

    // Default sizes for responsive images
    const defaultSizes = fill
        ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
        : `${width}px`;

    if (fill) {
        return (
            <div className={`relative ${containerClassName}`}>
                <Image
                    src={hasError ? fallbackImage : src}
                    alt={alt}
                    fill
                    priority={priority}
                    quality={quality}
                    sizes={sizes || defaultSizes}
                    placeholder="blur"
                    blurDataURL={defaultBlur}
                    className={`
                        transition-opacity duration-300
                        ${isLoading ? 'opacity-0' : 'opacity-100'}
                        ${className}
                    `}
                    style={{ objectFit }}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setHasError(true);
                        setIsLoading(false);
                    }}
                />
                {isLoading && (
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                )}
            </div>
        );
    }

    return (
        <div className={`relative inline-block ${containerClassName}`}>
            <Image
                src={hasError ? fallbackImage : src}
                alt={alt}
                width={width}
                height={height}
                priority={priority}
                quality={quality}
                sizes={sizes || defaultSizes}
                placeholder="blur"
                blurDataURL={defaultBlur}
                className={`
                    transition-opacity duration-300
                    ${isLoading ? 'opacity-0' : 'opacity-100'}
                    ${className}
                `}
                style={{ objectFit }}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setHasError(true);
                    setIsLoading(false);
                }}
            />
            {isLoading && (
                <div 
                    className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"
                    style={{ width, height }}
                />
            )}
        </div>
    );
}

/**
 * Avatar component with optimized loading
 */
export function Avatar({
    src,
    alt,
    size = 48,
    className = '',
}: {
    src: string;
    alt: string;
    size?: number;
    className?: string;
}) {
    return (
        <OptimizedImage
            src={src}
            alt={alt}
            width={size}
            height={size}
            className={`rounded-full ${className}`}
            objectFit="cover"
        />
    );
}

/**
 * Hero/Banner image with priority loading
 */
export function HeroImage({
    src,
    alt,
    className = '',
    containerClassName = '',
}: {
    src: string;
    alt: string;
    className?: string;
    containerClassName?: string;
}) {
    return (
        <OptimizedImage
            src={src}
            alt={alt}
            fill
            priority
            sizes="100vw"
            className={className}
            containerClassName={`w-full h-[50vh] md:h-[60vh] lg:h-[70vh] ${containerClassName}`}
            objectFit="cover"
        />
    );
}

/**
 * Project thumbnail with hover effect
 */
export function ProjectThumbnail({
    src,
    alt,
    className = '',
}: {
    src: string;
    alt: string;
    className?: string;
}) {
    return (
        <div className="group relative overflow-hidden">
            <OptimizedImage
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={`
                    transform transition-transform duration-300
                    group-hover:scale-105
                    ${className}
                `}
                containerClassName="aspect-video w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
    );
}

export default OptimizedImage;
