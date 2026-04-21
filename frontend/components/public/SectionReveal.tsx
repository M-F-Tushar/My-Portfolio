'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface SectionRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export default function SectionReveal({ children, className, delay = 0 }: SectionRevealProps) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.24 }}
            transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay,
            }}
        >
            {children}
        </motion.div>
    );
}
