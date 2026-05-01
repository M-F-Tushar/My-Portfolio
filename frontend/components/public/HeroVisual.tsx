'use client';

import { motion, useReducedMotion } from 'framer-motion';

const traces = [
    'M 4 18 H 34 C 42 18 42 32 50 32 H 96',
    'M 6 44 H 24 C 36 44 36 26 48 26 H 94',
    'M 2 70 H 30 C 42 70 42 52 54 52 H 98',
    'M 12 86 H 40 C 50 86 50 68 62 68 H 92',
];

const columns = [12, 24, 36, 48, 60, 72, 84];

export default function HeroVisual() {
    const prefersReducedMotion = useReducedMotion();

    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_34%,rgba(34,211,238,0.16),transparent_30%),linear-gradient(180deg,rgba(2,6,23,0),rgba(2,6,23,0.74))]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(34,211,238,0.08)_1px,transparent_1px),linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:96px_96px] opacity-30" />
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-75">
                <defs>
                    <linearGradient id="system-trace" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(34,211,238,0)" />
                        <stop offset="45%" stopColor="rgba(34,211,238,0.34)" />
                        <stop offset="100%" stopColor="rgba(52,211,153,0.18)" />
                    </linearGradient>
                </defs>
                {traces.map((path, index) => (
                    <motion.path
                        key={path}
                        d={path}
                        fill="none"
                        stroke="url(#system-trace)"
                        strokeWidth="0.16"
                        strokeLinecap="round"
                        strokeDasharray="1.2 2.2"
                        animate={prefersReducedMotion ? { strokeDashoffset: 0 } : { strokeDashoffset: [0, -14] }}
                        transition={{ duration: 11 + index * 1.4, repeat: Infinity, ease: 'linear' }}
                    />
                ))}
            </svg>
            {columns.map((left, index) => (
                <motion.span
                    key={left}
                    className="absolute top-[18%] h-[64%] w-px bg-gradient-to-b from-transparent via-cyan-200/16 to-transparent"
                    style={{ left: `${left}%` }}
                    animate={prefersReducedMotion ? { opacity: 0.28 } : { opacity: [0.12, 0.34, 0.12] }}
                    transition={{ duration: 4.5, repeat: Infinity, delay: index * 0.25 }}
                />
            ))}
            <motion.div
                className="absolute right-[9%] top-[21%] h-64 w-[28rem] -skew-y-6 rounded-lg border border-cyan-200/10 bg-cyan-200/[0.03] blur-[1px]"
                animate={prefersReducedMotion ? { y: 0 } : { y: [0, -10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.028),transparent)] bg-[size:100%_14px] opacity-20" />
        </div>
    );
}
