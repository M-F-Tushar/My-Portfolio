/**
 * Active Section Hook
 * 
 * Tracks which section is currently in view for navigation highlighting.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseActiveSectionOptions {
    sections: string[];
    offset?: number;
    threshold?: number;
}

/**
 * Hook to track the currently active section based on scroll position
 */
export function useActiveSection({ 
    sections, 
    offset = 100,
    threshold = 0.3 
}: UseActiveSectionOptions) {
    const [activeSection, setActiveSection] = useState<string>(sections[0] || '');

    const handleScroll = useCallback(() => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // Check if we're at the top of the page
        if (scrollY < offset) {
            setActiveSection(sections[0] || '');
            return;
        }

        // Check if we're at the bottom of the page
        if (window.innerHeight + scrollY >= document.body.scrollHeight - 100) {
            setActiveSection(sections[sections.length - 1] || '');
            return;
        }

        // Find which section is currently in view
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = document.getElementById(sections[i]);
            if (section) {
                const rect = section.getBoundingClientRect();
                const sectionTop = rect.top + scrollY;
                
                // Check if the section top is above our scroll position with offset
                if (scrollY >= sectionTop - offset - windowHeight * threshold) {
                    setActiveSection(sections[i]);
                    break;
                }
            }
        }
    }, [sections, offset, threshold]);

    useEffect(() => {
        // Initial check
        handleScroll();

        // Add scroll listener with throttling
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [handleScroll]);

    return activeSection;
}

/**
 * Smooth scroll to a section
 */
export function scrollToSection(sectionId: string, offset = 80) {
    const section = document.getElementById(sectionId);
    if (section) {
        const top = section.offsetTop - offset;
        window.scrollTo({
            top,
            behavior: 'smooth',
        });
    }
}

export default useActiveSection;
