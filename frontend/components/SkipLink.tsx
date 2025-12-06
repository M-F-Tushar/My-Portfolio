/**
 * Skip to Content Link Component
 * 
 * Accessibility feature that allows keyboard users to skip navigation.
 */

import React from 'react';

interface SkipLinkProps {
    targetId?: string;
    label?: string;
}

export default function SkipLink({ 
    targetId = 'main-content',
    label = 'Skip to main content' 
}: SkipLinkProps) {
    return (
        <a
            href={`#${targetId}`}
            className="
                sr-only focus:not-sr-only
                fixed top-4 left-4 z-[100]
                px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg
                shadow-lg
                focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2
                transform transition-transform
                focus:translate-y-0 -translate-y-16
            "
        >
            {label}
        </a>
    );
}
