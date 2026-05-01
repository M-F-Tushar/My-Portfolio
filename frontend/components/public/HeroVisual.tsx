'use client';

import { motion, useReducedMotion } from 'framer-motion';

const graphPaths = [
    'M 6 22 C 18 14 28 30 40 21 S 62 14 74 25 S 88 42 96 32',
    'M 4 48 C 18 42 25 58 38 50 S 56 36 70 48 S 86 66 98 56',
    'M 10 78 C 24 66 34 82 48 70 S 70 58 88 76',
    'M 22 12 C 32 30 36 48 48 62 S 66 78 82 90',
    'M 76 10 C 68 28 62 40 66 56 S 78 76 70 92',
];

const neuralNodes = [
    { left: 12, top: 22, size: 0.85, delay: 0 },
    { left: 28, top: 31, size: 0.62, delay: 0.2 },
    { left: 41, top: 22, size: 0.72, delay: 0.4 },
    { left: 58, top: 18, size: 0.95, delay: 0.6 },
    { left: 75, top: 26, size: 0.7, delay: 0.8 },
    { left: 89, top: 38, size: 0.84, delay: 1 },
    { left: 18, top: 52, size: 0.74, delay: 1.2 },
    { left: 38, top: 50, size: 1.05, delay: 1.4 },
    { left: 56, top: 42, size: 0.66, delay: 1.6 },
    { left: 72, top: 54, size: 0.9, delay: 1.8 },
    { left: 27, top: 76, size: 0.68, delay: 2 },
    { left: 48, top: 70, size: 0.82, delay: 2.2 },
    { left: 69, top: 82, size: 0.7, delay: 2.4 },
];

export default function HeroVisual() {
    const prefersReducedMotion = useReducedMotion();

    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_38%,rgba(34,211,238,0.2),transparent_32%),radial-gradient(circle_at_42%_28%,rgba(52,211,153,0.1),transparent_30%),linear-gradient(180deg,rgba(2,6,23,0),rgba(2,6,23,0.78))]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(34,211,238,0.07)_1px,transparent_1px),linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:88px_88px] opacity-30" />

            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-80">
                <defs>
                    <linearGradient id="neural-trace" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(34,211,238,0.06)" />
                        <stop offset="48%" stopColor="rgba(34,211,238,0.44)" />
                        <stop offset="100%" stopColor="rgba(52,211,153,0.18)" />
                    </linearGradient>
                </defs>
                {graphPaths.map((path, index) => (
                    <motion.path
                        key={path}
                        d={path}
                        fill="none"
                        stroke="url(#neural-trace)"
                        strokeLinecap="round"
                        strokeWidth="0.18"
                        strokeDasharray="1.1 2"
                        animate={prefersReducedMotion ? { strokeDashoffset: 0 } : { strokeDashoffset: [0, -16] }}
                        transition={{ duration: 13 + index * 1.7, repeat: Infinity, ease: 'linear' }}
                    />
                ))}
            </svg>

            {neuralNodes.map((node) => (
                <motion.span
                    key={`${node.left}-${node.top}`}
                    className="absolute rounded-full border border-cyan-100/30 bg-cyan-200/80 shadow-[0_0_28px_rgba(34,211,238,0.42)]"
                    style={{
                        left: `${node.left}%`,
                        top: `${node.top}%`,
                        width: `${node.size}rem`,
                        height: `${node.size}rem`,
                    }}
                    animate={prefersReducedMotion ? { opacity: 0.65, scale: 1 } : { opacity: [0.34, 0.95, 0.45], scale: [1, 1.16, 1] }}
                    transition={{ duration: 5.6, repeat: Infinity, ease: 'easeInOut', delay: node.delay }}
                />
            ))}

            <motion.div
                className="absolute right-[8%] top-[14%] h-[34rem] w-[34rem] rounded-full border border-cyan-200/18"
                animate={prefersReducedMotion ? { rotate: 0 } : { rotate: 360 }}
                transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
                className="absolute right-[14%] top-[20%] h-[22rem] w-[22rem] rounded-full border border-emerald-200/14"
                animate={prefersReducedMotion ? { rotate: 0 } : { rotate: -360 }}
                transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.025),transparent)] bg-[size:100%_14px] opacity-20" />
        </div>
    );
}
