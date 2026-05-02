import type { ReactNode } from 'react';

interface SectionRevealProps {
    id?: string;
    children: ReactNode;
    className?: string;
    delay?: number;
}

export default function SectionReveal({ id, children, className, delay = 0 }: SectionRevealProps) {
    return (
        <section
            id={id}
            className={className}
            style={delay ? { animationDelay: `${delay}s` } : undefined}
        >
            {children}
        </section>
    );
}
