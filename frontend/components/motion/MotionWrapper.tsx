import { motion, Variants, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

// ===== VARIANT DEFINITIONS =====

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
};

export const fadeInDown: Variants = {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
};

export const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
};

export const fadeInRight: Variants = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
};

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
};

export const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

export const staggerContainerFast: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        },
    },
};

// Default spring transition
export const springTransition = {
    type: 'spring' as const,
    stiffness: 100,
    damping: 15,
};

// Smooth easing
export const smoothTransition = {
    duration: 0.6,
    ease: [0.25, 0.46, 0.45, 0.94] as number[],
};

// ===== WRAPPER COMPONENTS =====

interface MotionSectionProps {
    children: ReactNode;
    className?: string;
    id?: string;
    delay?: number;
}

export function MotionSection({ children, className, id, delay = 0 }: MotionSectionProps) {
    const shouldReduce = useReducedMotion();

    return (
        <motion.section
            id={id}
            className={className}
            initial={shouldReduce ? undefined : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            transition={{ ...smoothTransition, delay }}
            variants={fadeInUp}
        >
            {children}
        </motion.section>
    );
}

interface StaggerContainerProps {
    children: ReactNode;
    className?: string;
    fast?: boolean;
}

export function StaggerContainer({ children, className, fast }: StaggerContainerProps) {
    const shouldReduce = useReducedMotion();

    return (
        <motion.div
            className={className}
            initial={shouldReduce ? undefined : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fast ? staggerContainerFast : staggerContainer}
        >
            {children}
        </motion.div>
    );
}

interface StaggerItemProps {
    children: ReactNode;
    className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
    return (
        <motion.div
            className={className}
            variants={fadeInUp}
            transition={smoothTransition}
        >
            {children}
        </motion.div>
    );
}

interface HoverCardProps {
    children: ReactNode;
    className?: string;
}

export function HoverCard({ children, className }: HoverCardProps) {
    return (
        <motion.div
            className={className}
            whileHover={{
                y: -8,
                transition: { duration: 0.3 },
            }}
            whileTap={{ scale: 0.98 }}
        >
            {children}
        </motion.div>
    );
}

interface GlowHoverProps {
    children: ReactNode;
    className?: string;
}

export function GlowHover({ children, className }: GlowHoverProps) {
    return (
        <motion.div
            className={className}
            whileHover={{
                boxShadow: '0 0 30px rgba(6, 182, 212, 0.3)',
                borderColor: 'rgba(6, 182, 212, 0.5)',
            }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    );
}

interface MotionFadeProps {
    children: ReactNode;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right';
    delay?: number;
}

export function MotionFade({ children, className, direction = 'up', delay = 0 }: MotionFadeProps) {
    const variants: Record<string, Variants> = {
        up: fadeInUp,
        down: fadeInDown,
        left: fadeInLeft,
        right: fadeInRight,
    };

    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            transition={{ ...smoothTransition, delay }}
            variants={variants[direction]}
        >
            {children}
        </motion.div>
    );
}
