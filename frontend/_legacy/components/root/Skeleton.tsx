/**
 * Skeleton Loading Components
 * 
 * Reusable skeleton components for loading states.
 */

import React from 'react';

interface SkeletonProps {
    className?: string;
}

/**
 * Base skeleton element with shimmer animation
 */
export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div 
            className={`
                animate-pulse bg-gradient-to-r from-dark-800 via-dark-700 to-dark-800
                bg-[length:400%_100%] animate-shimmer rounded
                ${className}
            `}
            aria-hidden="true"
        />
    );
}

/**
 * Text line skeleton
 */
export function SkeletonText({ lines = 1, className = '' }: { lines?: number; className?: string }) {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton 
                    key={i} 
                    className={`h-4 ${i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}`} 
                />
            ))}
        </div>
    );
}

/**
 * Circular avatar skeleton
 */
export function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-24 h-24',
    };
    
    return <Skeleton className={`${sizeClasses[size]} rounded-full`} />;
}

/**
 * Card skeleton for project/content cards
 */
export function SkeletonCard({ className = '' }: SkeletonProps) {
    return (
        <div className={`card-neon overflow-hidden ${className}`}>
            {/* Image placeholder */}
            <Skeleton className="aspect-video w-full" />
            
            {/* Content */}
            <div className="p-6 space-y-4">
                {/* Title */}
                <Skeleton className="h-6 w-3/4" />
                
                {/* Description */}
                <SkeletonText lines={2} />
                
                {/* Tags */}
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                </div>
                
                {/* Links */}
                <div className="flex gap-4 pt-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                </div>
            </div>
        </div>
    );
}

/**
 * Profile skeleton for hero section
 */
export function SkeletonProfile() {
    return (
        <div className="text-center space-y-6 animate-pulse">
            {/* Avatar */}
            <div className="flex justify-center">
                <SkeletonAvatar size="xl" />
            </div>
            
            {/* Name */}
            <Skeleton className="h-12 w-64 mx-auto" />
            
            {/* Title */}
            <Skeleton className="h-8 w-48 mx-auto" />
            
            {/* Bio */}
            <div className="max-w-lg mx-auto">
                <SkeletonText lines={2} />
            </div>
            
            {/* Buttons */}
            <div className="flex justify-center gap-4">
                <Skeleton className="h-12 w-32 rounded-lg" />
                <Skeleton className="h-12 w-32 rounded-lg" />
            </div>
        </div>
    );
}

/**
 * Experience card skeleton
 */
export function SkeletonExperience() {
    return (
        <div className="card-neon p-6 space-y-4">
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-24" />
            </div>
            
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
            
            <div className="flex gap-2 flex-wrap">
                <Skeleton className="h-6 w-16 rounded" />
                <Skeleton className="h-6 w-20 rounded" />
                <Skeleton className="h-6 w-14 rounded" />
                <Skeleton className="h-6 w-18 rounded" />
            </div>
        </div>
    );
}

/**
 * Skills section skeleton
 */
export function SkeletonSkills() {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card-neon p-6 space-y-4">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <Skeleton className="h-6 w-32" />
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-14 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Skeleton;
