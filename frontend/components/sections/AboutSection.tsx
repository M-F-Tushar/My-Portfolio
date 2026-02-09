import Image from 'next/image';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Profile } from '@prisma/client';
import { MotionFade, StaggerContainer, StaggerItem } from '../motion/MotionWrapper';

interface AboutSectionProps {
    profile: Profile;
}

function AnimatedCounter({ target, label }: { target: number; label: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const duration = 1500;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [isInView, target]);

    return (
        <div ref={ref} className="card-neon p-6 text-center">
            <div className="text-3xl font-bold text-cyan-400 font-mono">{count}+</div>
            <div className="text-gray-500 text-sm mt-1">{label}</div>
        </div>
    );
}

export default function AboutSection({ profile }: AboutSectionProps) {
    return (
        <section id="about" className="py-24 px-4 bg-dark-900 bg-dots relative">
            <div className="max-w-5xl mx-auto">
                <MotionFade>
                    <h2 className="text-4xl font-bold mb-12 text-center text-white">
                        About <span className="gradient-text">Me</span>
                    </h2>
                </MotionFade>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <MotionFade direction="left">
                        <div className="card-neon p-1 rounded-xl overflow-hidden">
                            <div className="aspect-square bg-dark-800 rounded-lg flex items-center justify-center overflow-hidden relative">
                                {profile.aboutImage ? (
                                    <Image
                                        src={profile.aboutImage}
                                        alt={`About ${profile.name}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                ) : (
                                    <div className="text-8xl text-cyan-400/20">
                                        {profile.name?.charAt(0) || '?'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </MotionFade>

                    <div className="space-y-6">
                        <MotionFade direction="right">
                            <div className="text-lg text-gray-400 leading-relaxed whitespace-pre-line">
                                {profile.summary}
                            </div>
                        </MotionFade>

                        <StaggerContainer className="grid grid-cols-2 gap-4 pt-4">
                            <StaggerItem>
                                <AnimatedCounter target={parseInt(profile.yearsOfExperience) || 0} label="Years Experience" />
                            </StaggerItem>
                            <StaggerItem>
                                <AnimatedCounter target={parseInt(profile.modelsDeployed) || 0} label="ML Models Deployed" />
                            </StaggerItem>
                        </StaggerContainer>
                    </div>
                </div>
            </div>
        </section>
    );
}
