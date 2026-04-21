'use client';

import { motion, useReducedMotion } from 'framer-motion';

const nodes = [
    { cx: 16, cy: 22, r: 2.4, delay: 0 },
    { cx: 33, cy: 16, r: 1.8, delay: 0.2 },
    { cx: 52, cy: 24, r: 2.8, delay: 0.4 },
    { cx: 70, cy: 20, r: 1.9, delay: 0.6 },
    { cx: 84, cy: 30, r: 2.1, delay: 0.8 },
    { cx: 24, cy: 48, r: 2.1, delay: 1 },
    { cx: 44, cy: 42, r: 3.2, delay: 1.2 },
    { cx: 64, cy: 52, r: 2.3, delay: 1.4 },
    { cx: 78, cy: 64, r: 2, delay: 1.6 },
    { cx: 35, cy: 72, r: 1.8, delay: 1.8 },
    { cx: 54, cy: 82, r: 2.6, delay: 2 },
];

const links = [
    'M 16 22 L 33 16 L 52 24 L 70 20 L 84 30',
    'M 24 48 L 44 42 L 64 52 L 78 64',
    'M 16 22 L 24 48 L 35 72 L 54 82',
    'M 33 16 L 44 42 L 52 24 L 64 52',
    'M 35 72 L 44 42 L 78 64',
];

export default function HeroVisual() {
    const prefersReducedMotion = useReducedMotion();
    const ringTransition = prefersReducedMotion
        ? { duration: 0 }
        : { duration: 24, repeat: Infinity, ease: 'linear' };
    const nodeTransition = prefersReducedMotion
        ? { duration: 0 }
        : { duration: 5.5, repeat: Infinity, ease: 'easeInOut' };

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
        >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.0),rgba(2,6,23,0.62))]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(34,211,238,0.04)_50%,transparent_100%)] opacity-80" />

            <motion.div
                className="absolute left-[12%] top-[14%] h-[26rem] w-[26rem] rounded-full border border-cyan-300/18"
                animate={prefersReducedMotion ? { rotate: 0 } : { rotate: 360 }}
                transition={ringTransition}
                style={{ transformOrigin: '50% 50%' }}
            />
            <motion.div
                className="absolute right-[10%] top-[18%] h-[18rem] w-[18rem] rounded-full border border-emerald-300/14"
                animate={prefersReducedMotion ? { rotate: 0 } : { rotate: -360 }}
                transition={{ ...ringTransition, duration: 30 }}
                style={{ transformOrigin: '50% 50%' }}
            />

            <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
            >
                <defs>
                    <linearGradient id="hero-wire" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(34, 211, 238, 0.18)" />
                        <stop offset="50%" stopColor="rgba(52, 211, 153, 0.32)" />
                        <stop offset="100%" stopColor="rgba(56, 189, 248, 0.14)" />
                    </linearGradient>
                </defs>

                {links.map((path, index) => (
                    <motion.path
                        key={path}
                        d={path}
                        fill="none"
                        stroke="url(#hero-wire)"
                        strokeWidth="0.18"
                        strokeLinecap="round"
                        strokeDasharray="0.8 1.8"
                        initial={false}
                        animate={
                            prefersReducedMotion
                                ? { strokeDashoffset: 0 }
                                : { strokeDashoffset: [0, -8] }
                        }
                        transition={{
                            duration: 10 + index * 1.7,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />
                ))}
            </svg>

            <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.03),transparent)] bg-[size:100%_16px] opacity-15" />

            {nodes.map((node) => (
                <motion.span
                    key={`${node.cx}-${node.cy}`}
                    className="absolute rounded-full bg-cyan-200/90 shadow-[0_0_18px_rgba(34,211,238,0.55)]"
                    style={{
                        left: `${node.cx}%`,
                        top: `${node.cy}%`,
                        width: `${node.r * 0.55}rem`,
                        height: `${node.r * 0.55}rem`,
                    }}
                    animate={
                        prefersReducedMotion
                            ? { opacity: 0.7, scale: 1 }
                            : {
                                  opacity: [0.4, 1, 0.5],
                                  scale: [1, 1.18, 1],
                              }
                    }
                    transition={{
                        ...nodeTransition,
                        delay: node.delay,
                    }}
                />
            ))}

            <motion.div
                className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20"
                animate={prefersReducedMotion ? { scale: 1 } : { scale: [1, 1.06, 1] }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
            <motion.div
                className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-300/12"
                animate={prefersReducedMotion ? { scale: 1 } : { scale: [1, 0.96, 1] }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
        </div>
    );
}
