import Image from 'next/image';
import { Download, ExternalLink } from 'lucide-react';
import { Profile, SocialLink } from '@prisma/client';
import SocialIcon from '../SocialIcon';

interface HeroSectionProps {
    profile: Profile;
    socialLinks: SocialLink[];
}

export default function HeroSection({ profile, socialLinks }: HeroSectionProps) {
    return (
        <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white px-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <div className="mb-8 animate-fadeIn">
                    <div className="w-32 h-32 mx-auto bg-white/20 rounded-full flex items-center justify-center text-6xl overflow-hidden ring-4 ring-white/30 animate-scale-pulse">
                        {profile.avatarUrl ? (
                            <Image src={profile.avatarUrl} alt={`${profile.name} - AI/ML Engineer`} width={128} height={128} className="w-full h-full object-cover" priority />
                        ) : (
                            <span role="img" aria-label="Profile avatar">👤</span>
                        )}
                    </div>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fadeIn stagger-1">
                    Hi, I&apos;m <span className="gradient-shimmer">{profile.name}</span>
                </h1>

                <p className="text-2xl md:text-3xl mb-4 animate-fadeIn stagger-2">
                    <span className="gradient-shimmer">{profile.title}</span>
                </p>

                <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto animate-fadeIn stagger-3">
                    {profile.bio}
                </p>

                <div className="flex flex-wrap justify-center gap-4 animate-fadeIn stagger-4">
                    <a href="#projects" className="btn-primary bg-white text-primary-700 hover:bg-primary-50 hover:scale-105">
                        View My Work
                    </a>
                    <a href="#contact" className="btn-secondary bg-primary-800 text-white hover:bg-primary-900 hover:scale-105">
                        Get In Touch
                    </a>
                    {profile.resumeUrl && (
                        <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary bg-accent-600 text-white hover:bg-accent-700 flex items-center gap-2 hover:scale-105">
                            <Download className="w-5 h-5" />
                            Download Resume
                        </a>
                    )}
                </div>

                {socialLinks.length > 0 && (
                    <div className="flex justify-center gap-4 mt-8 animate-fadeIn stagger-4">
                        {socialLinks.map((link) => (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                                aria-label={link.platform}
                            >
                                <SocialIcon platform={link.icon} className="w-6 h-6" />
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
