/**
 * Page Transition Component
 * Provides smooth page transitions using CSS animations
 * Lightweight alternative to Framer Motion
 */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
    const router = useRouter();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [displayChildren, setDisplayChildren] = useState(children);

    useEffect(() => {
        const handleStart = (url: string) => {
            if (url !== router.asPath) {
                setIsTransitioning(true);
            }
        };

        const handleComplete = () => {
            setIsTransitioning(false);
            setDisplayChildren(children);
        };

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router, children]);

    // Update children when not transitioning
    useEffect(() => {
        if (!isTransitioning) {
            setDisplayChildren(children);
        }
    }, [children, isTransitioning]);

    return (
        <div
            className={`
                transition-all duration-300 ease-out
                ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
                ${className}
            `}
        >
            {displayChildren}
        </div>
    );
}

/**
 * Fade transition variant
 */
export function FadeTransition({ children, className = '' }: PageTransitionProps) {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleStart = () => setIsVisible(false);
        const handleComplete = () => {
            setTimeout(() => setIsVisible(true), 50);
        };

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router]);

    return (
        <div
            className={`
                transition-opacity duration-200 ease-in-out
                ${isVisible ? 'opacity-100' : 'opacity-0'}
                ${className}
            `}
        >
            {children}
        </div>
    );
}

/**
 * Slide transition variant
 */
export function SlideTransition({ 
    children, 
    className = '',
    direction = 'up'
}: PageTransitionProps & { direction?: 'up' | 'down' | 'left' | 'right' }) {
    const router = useRouter();
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const handleStart = () => setIsTransitioning(true);
        const handleComplete = () => {
            setTimeout(() => setIsTransitioning(false), 50);
        };

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router]);

    const getTransformClass = () => {
        if (!isTransitioning) return 'translate-x-0 translate-y-0';
        
        switch (direction) {
            case 'up': return '-translate-y-4';
            case 'down': return 'translate-y-4';
            case 'left': return '-translate-x-4';
            case 'right': return 'translate-x-4';
            default: return '-translate-y-4';
        }
    };

    return (
        <div
            className={`
                transition-all duration-300 ease-out
                ${isTransitioning ? `opacity-0 ${getTransformClass()}` : 'opacity-100'}
                ${className}
            `}
        >
            {children}
        </div>
    );
}

/**
 * Loading bar that shows during page transitions
 */
export function TransitionProgressBar() {
    const router = useRouter();
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        const handleStart = () => {
            setIsVisible(true);
            setProgress(0);
            timer = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(timer);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 100);
        };

        const handleComplete = () => {
            clearInterval(timer);
            setProgress(100);
            setTimeout(() => {
                setIsVisible(false);
                setProgress(0);
            }, 200);
        };

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            clearInterval(timer);
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200 dark:bg-gray-800">
            <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-200 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}

export default PageTransition;
