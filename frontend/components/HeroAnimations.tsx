/**
 * Hero Section Animations
 * Animated gradient background, floating particles, typing effect, scroll indicator
 */
import React, { useEffect, useState, useRef } from 'react';

/**
 * Animated Gradient Background
 */
export function AnimatedGradient({
    children,
    className = '',
    colors = ['#667eea', '#764ba2', '#6B8DD6', '#8E37D7'],
}: {
    children?: React.ReactNode;
    className?: string;
    colors?: string[];
}) {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            <div
                className="absolute inset-0 animate-gradient-shift"
                style={{
                    background: `linear-gradient(-45deg, ${colors.join(', ')})`,
                    backgroundSize: '400% 400%',
                }}
            />
            <div className="relative z-10">{children}</div>
        </div>
    );
}

/**
 * Floating Particles Effect
 */
export function FloatingParticles({
    count = 50,
    className = '',
}: {
    count?: number;
    className?: string;
}) {
    const [particles, setParticles] = useState<Array<{
        id: number;
        x: number;
        y: number;
        size: number;
        duration: number;
        delay: number;
    }>>([]);

    useEffect(() => {
        const newParticles = Array.from({ length: count }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 1,
            duration: Math.random() * 20 + 10,
            delay: Math.random() * 5,
        }));
        setParticles(newParticles);
    }, [count]);

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute rounded-full bg-white/20 dark:bg-white/10 animate-float"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        animationDuration: `${particle.duration}s`,
                        animationDelay: `${particle.delay}s`,
                    }}
                />
            ))}
        </div>
    );
}

/**
 * Typing Animation Effect
 */
export function TypingText({
    texts,
    typingSpeed = 100,
    deletingSpeed = 50,
    pauseDuration = 2000,
    className = '',
    cursorClassName = '',
}: {
    texts: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    pauseDuration?: number;
    className?: string;
    cursorClassName?: string;
}) {
    const [displayText, setDisplayText] = useState('');
    const [textIndex, setTextIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (texts.length === 0) return;

        const currentText = texts[textIndex];

        if (isPaused) {
            const pauseTimer = setTimeout(() => {
                setIsPaused(false);
                setIsDeleting(true);
            }, pauseDuration);
            return () => clearTimeout(pauseTimer);
        }

        if (isDeleting) {
            if (displayText === '') {
                setIsDeleting(false);
                setTextIndex((prev) => (prev + 1) % texts.length);
            } else {
                const deleteTimer = setTimeout(() => {
                    setDisplayText((prev) => prev.slice(0, -1));
                }, deletingSpeed);
                return () => clearTimeout(deleteTimer);
            }
        } else {
            if (displayText === currentText) {
                setIsPaused(true);
            } else {
                const typeTimer = setTimeout(() => {
                    setDisplayText(currentText.slice(0, displayText.length + 1));
                }, typingSpeed);
                return () => clearTimeout(typeTimer);
            }
        }
    }, [displayText, textIndex, isDeleting, isPaused, texts, typingSpeed, deletingSpeed, pauseDuration]);

    return (
        <span className={className}>
            {displayText}
            <span
                className={`inline-block w-0.5 h-[1em] ml-1 bg-current animate-blink ${cursorClassName}`}
            />
        </span>
    );
}

/**
 * Scroll Indicator Animation
 */
export function ScrollIndicator({
    className = '',
    targetId,
    text = 'Scroll Down',
}: {
    className?: string;
    targetId?: string;
    text?: string;
}) {
    const handleClick = () => {
        if (targetId) {
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth',
            });
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`flex flex-col items-center gap-2 cursor-pointer group ${className}`}
            aria-label={text}
        >
            <span className="text-sm text-gray-600 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {text}
            </span>
            <div className="relative w-6 h-10 border-2 border-gray-400 dark:border-gray-500 rounded-full">
                <div className="absolute left-1/2 top-2 -translate-x-1/2 w-1.5 h-1.5 bg-gray-600 dark:bg-gray-400 rounded-full animate-scroll-indicator" />
            </div>
            <svg
                className="w-4 h-4 text-gray-400 dark:text-gray-500 animate-bounce-slow"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
            </svg>
        </button>
    );
}

/**
 * Glowing Text Effect
 */
export function GlowingText({
    children,
    className = '',
    glowColor = 'rgba(59, 130, 246, 0.5)',
}: {
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
}) {
    return (
        <span
            className={`relative inline-block ${className}`}
            style={{
                textShadow: `0 0 20px ${glowColor}, 0 0 40px ${glowColor}, 0 0 60px ${glowColor}`,
            }}
        >
            {children}
        </span>
    );
}

/**
 * Animated Counter
 */
export function AnimatedCounter({
    end,
    duration = 2000,
    prefix = '',
    suffix = '',
    className = '',
}: {
    end: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible) return;

        let startTime: number | null = null;
        const startValue = 0;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            // Easing function (ease-out-cubic)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.floor(startValue + (end - startValue) * easeOut);
            
            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isVisible, end, duration]);

    return (
        <span ref={ref} className={className}>
            {prefix}{count.toLocaleString()}{suffix}
        </span>
    );
}

/**
 * Parallax Container
 */
export function ParallaxSection({
    children,
    className = '',
    speed = 0.5,
}: {
    children: React.ReactNode;
    className?: string;
    speed?: number;
}) {
    const [offset, setOffset] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                const scrolled = window.scrollY;
                const elementTop = rect.top + scrolled;
                const relativeScroll = scrolled - elementTop + window.innerHeight;
                setOffset(relativeScroll * speed);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [speed]);

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            <div
                style={{
                    transform: `translateY(${offset}px)`,
                }}
            >
                {children}
            </div>
        </div>
    );
}

/**
 * Complete Hero Section Component
 */
export function HeroSection({
    title,
    subtitles,
    description,
    ctaButtons,
    className = '',
    showParticles = true,
    showScrollIndicator = true,
}: {
    title: string;
    subtitles?: string[];
    description?: string;
    ctaButtons?: React.ReactNode;
    className?: string;
    showParticles?: boolean;
    showScrollIndicator?: boolean;
}) {
    return (
        <section className={`relative min-h-screen flex items-center justify-center ${className}`}>
            {/* Animated Background */}
            <AnimatedGradient className="absolute inset-0" />
            
            {/* Floating Particles */}
            {showParticles && <FloatingParticles count={30} />}
            
            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                {/* Main Title */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                    <GlowingText>{title}</GlowingText>
                </h1>
                
                {/* Typing Subtitle */}
                {subtitles && subtitles.length > 0 && (
                    <div className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-6 h-12">
                        <TypingText texts={subtitles} />
                    </div>
                )}
                
                {/* Description */}
                {description && (
                    <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                        {description}
                    </p>
                )}
                
                {/* CTA Buttons */}
                {ctaButtons && (
                    <div className="flex flex-wrap gap-4 justify-center">
                        {ctaButtons}
                    </div>
                )}
            </div>
            
            {/* Scroll Indicator */}
            {showScrollIndicator && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                    <ScrollIndicator />
                </div>
            )}
        </section>
    );
}

export default HeroSection;
