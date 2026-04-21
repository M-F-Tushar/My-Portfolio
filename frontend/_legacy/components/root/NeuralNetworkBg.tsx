'use client';

import { useCallback, useEffect, useState, useMemo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import type { Container } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

export default function NeuralNetworkBg() {
    const [engineReady, setEngineReady] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setEngineReady(true);
        });
    }, []);

    const particlesLoaded = useCallback(async (_container?: Container) => {
        // Particles loaded
    }, []);

    const options = useMemo(() => ({
        fullScreen: false,
        background: {
            color: { value: 'transparent' },
        },
        fpsLimit: 60,
        interactivity: {
            detect_on: 'canvas' as any,
            events: {
                onHover: {
                    enable: !isMobile,
                    mode: 'grab' as const,
                },
                onClick: {
                    enable: !isMobile,
                    mode: 'repulse' as const,
                },
            },
            modes: {
                grab: {
                    distance: 180,
                    links: {
                        opacity: 0.5,
                        color: '#06b6d4',
                    },
                },
                repulse: {
                    distance: 150,
                    duration: 0.4,
                },
            },
        },
        particles: {
            color: {
                value: ['#06b6d4', '#3b82f6', '#22d3ee'],
            },
            links: {
                color: '#06b6d4',
                distance: 150,
                enable: true,
                opacity: 0.12,
                width: 1,
            },
            move: {
                enable: true,
                speed: isMobile ? 0.3 : 0.6,
                direction: 'none' as const,
                random: true,
                straight: false,
                outModes: {
                    default: 'bounce' as const,
                },
            },
            number: {
                density: {
                    enable: true,
                    width: 1920,
                    height: 1080,
                },
                value: isMobile ? 30 : 80,
            },
            opacity: {
                value: { min: 0.2, max: 0.6 },
                animation: {
                    enable: true,
                    speed: 0.5,
                    sync: false,
                },
            },
            shape: {
                type: 'circle',
            },
            size: {
                value: { min: 1, max: 3 },
            },
        },
        detectRetina: true,
    }), [isMobile]);

    if (!engineReady) return null;

    return (
        <Particles
            id="neural-network-bg"
            particlesLoaded={particlesLoaded}
            className="absolute inset-0 z-0"
            options={options}
        />
    );
}
