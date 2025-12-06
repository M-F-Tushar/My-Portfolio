/**
 * Scroll Animation Hook & Component
 * 
 * Provides scroll-triggered fade-in animations with:
 * - Intersection Observer for performance
 * - Staggered animations for lists
 * - Respects prefers-reduced-motion
 */

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface UseScrollAnimationOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

/**
 * Hook to detect when an element is in viewport
 */
export function useInView(options: UseScrollAnimationOptions = {}) {
    const {
        threshold = 0.1,
        rootMargin = '0px 0px -50px 0px',
        triggerOnce = true,
    } = options;

    const ref = useRef<HTMLElement>(null);
    const [isInView, setIsInView] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // Respect reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            setIsInView(true);
            setHasAnimated(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    if (triggerOnce) {
                        setHasAnimated(true);
                        observer.unobserve(element);
                    }
                } else if (!triggerOnce) {
                    setIsInView(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [threshold, rootMargin, triggerOnce]);

    return { ref, isInView, hasAnimated };
}

interface ScrollAnimationProps {
    children: React.ReactNode;
    animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale';
    delay?: number;
    duration?: number;
    className?: string;
}

/**
 * Component that animates children when scrolled into view
 */
export function ScrollAnimation({
    children,
    animation = 'fadeIn',
    delay = 0,
    duration = 600,
    className = '',
}: ScrollAnimationProps) {
    const { ref, isInView } = useInView();

    const animations = {
        fadeIn: {
            hidden: 'opacity-0 translate-y-8',
            visible: 'opacity-100 translate-y-0',
        },
        slideUp: {
            hidden: 'opacity-0 translate-y-16',
            visible: 'opacity-100 translate-y-0',
        },
        slideLeft: {
            hidden: 'opacity-0 translate-x-16',
            visible: 'opacity-100 translate-x-0',
        },
        slideRight: {
            hidden: 'opacity-0 -translate-x-16',
            visible: 'opacity-100 translate-x-0',
        },
        scale: {
            hidden: 'opacity-0 scale-95',
            visible: 'opacity-100 scale-100',
        },
    };

    const { hidden, visible } = animations[animation];

    return (
        <div
            ref={ref as React.RefObject<HTMLDivElement>}
            className={`
                transition-all ease-out
                ${isInView ? visible : hidden}
                ${className}
            `}
            style={{
                transitionDuration: `${duration}ms`,
                transitionDelay: `${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}

interface StaggeredListProps {
    children: React.ReactNode[];
    animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale';
    staggerDelay?: number;
    baseDelay?: number;
    className?: string;
    itemClassName?: string;
}

/**
 * Component that staggers animations for a list of children
 */
export function StaggeredList({
    children,
    animation = 'fadeIn',
    staggerDelay = 100,
    baseDelay = 0,
    className = '',
    itemClassName = '',
}: StaggeredListProps) {
    return (
        <div className={className}>
            {React.Children.map(children, (child, index) => (
                <ScrollAnimation
                    key={index}
                    animation={animation}
                    delay={baseDelay + index * staggerDelay}
                    className={itemClassName}
                >
                    {child}
                </ScrollAnimation>
            ))}
        </div>
    );
}

/**
 * Section component with built-in scroll animation
 */
export function AnimatedSection({
    children,
    id,
    className = '',
    animation = 'fadeIn',
}: {
    children: React.ReactNode;
    id?: string;
    className?: string;
    animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale';
}) {
    return (
        <section id={id}>
            <ScrollAnimation
                animation={animation}
                className={className}
            >
                {children}
            </ScrollAnimation>
        </section>
    );
}

export default ScrollAnimation;
