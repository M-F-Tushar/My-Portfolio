import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Download, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Profile, SocialLink } from '@prisma/client';
import SocialIcon from '../SocialIcon';
import { fadeInUp, staggerContainer, scaleIn, smoothTransition } from '../motion/MotionWrapper';

const NeuralNetworkBg = dynamic(() => import('../NeuralNetworkBg'), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-dark-950" />,
});

interface HeroSectionProps {
    profile: Profile;
    socialLinks: SocialLink[];
}

export default function HeroSection({ profile, socialLinks }: HeroSectionProps) {
    const roles = [profile.title, 'AI/ML Enthusiast', 'Full-Stack Developer'];

    return (
        <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark-950">
            {/* Particle Background */}
            <NeuralNetworkBg />

            {/* Grid overlay */}
            <div className="absolute inset-0 bg-grid opacity-40 z-[1]" />

            {/* Radial gradient center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl z-[1]" />

            {/* Content */}
            <motion.div
                className="max-w-4xl mx-auto text-center relative z-10 px-4"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
            >
                {/* Avatar */}
                <motion.div className="mb-8" variants={scaleIn} transition={smoothTransition}>
                    <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center overflow-hidden ring-4 ring-cyan-500/30 animate-glow-pulse">
                        {profile.avatarUrl ? (
                            <Image
                                src={profile.avatarUrl}
                                alt={`${profile.name} - AI/ML Engineer`}
                                width={128}
                                height={128}
                                className="w-full h-full object-cover"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full bg-dark-700 flex items-center justify-center text-5xl text-cyan-400">
                                {profile.name?.charAt(0) || '?'}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Name */}
                <motion.h1
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-white glow-text"
                    variants={fadeInUp}
                    transition={{ ...smoothTransition, delay: 0.1 }}
                >
                    Hi, I&apos;m <span className="gradient-shimmer">{profile.name}</span>
                </motion.h1>

                {/* Subtitle / Title */}
                <motion.div
                    className="text-xl sm:text-2xl md:text-3xl mb-2 font-medium"
                    variants={fadeInUp}
                    transition={{ ...smoothTransition, delay: 0.2 }}
                >
                    <span className="gradient-text">{profile.title}</span>
                </motion.div>

                {/* Role tags */}
                <motion.div
                    className="flex flex-wrap justify-center gap-2 mb-6"
                    variants={fadeInUp}
                    transition={{ ...smoothTransition, delay: 0.25 }}
                >
                    {roles.map((role) => (
                        <span key={role} className="tech-tag text-xs">
                            {role}
                        </span>
                    ))}
                </motion.div>

                {/* Bio */}
                <motion.p
                    className="text-base sm:text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed"
                    variants={fadeInUp}
                    transition={{ ...smoothTransition, delay: 0.3 }}
                >
                    {profile.bio}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    className="flex flex-wrap justify-center gap-4 mb-8"
                    variants={fadeInUp}
                    transition={{ ...smoothTransition, delay: 0.4 }}
                >
                    <a href="#projects" className="btn-primary">
                        View My Work
                    </a>
                    <a href="#contact" className="btn-secondary">
                        Get In Touch
                    </a>
                    {profile.resumeUrl && (
                        <a
                            href={profile.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-ghost flex items-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            Resume
                        </a>
                    )}
                </motion.div>

                {/* Social Links */}
                {socialLinks.length > 0 && (
                    <motion.div
                        className="flex justify-center gap-4"
                        variants={fadeInUp}
                        transition={{ ...smoothTransition, delay: 0.5 }}
                    >
                        {socialLinks.map((link) => (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 border border-dark-600 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                                aria-label={link.platform}
                            >
                                <SocialIcon platform={link.icon} className="w-5 h-5" />
                            </a>
                        ))}
                    </motion.div>
                )}
            </motion.div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-cyan-400/50"
                >
                    <ChevronDown className="w-6 h-6" />
                </motion.div>
            </div>
        </section>
    );
}
