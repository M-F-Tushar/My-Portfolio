import { useState, useEffect } from 'react';
import { Mail, Code2 } from 'lucide-react';
import SocialIcon from './SocialIcon';

interface FooterData {
    profile: {
        name: string;
        email: string;
    } | null;
    socialLinks: Array<{
        id: number;
        platform: string;
        url: string;
        icon: string;
    }>;
}

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const [footerData, setFooterData] = useState<FooterData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/footer-data')
            .then(res => res.json())
            .then(data => {
                setFooterData(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching footer data:', error);
                setLoading(false);
            });
    }, []);

    const profileName = footerData?.profile?.name || 'AI/ML Engineer';
    const profileEmail = footerData?.profile?.email || 'contact@example.com';
    const socialLinks = footerData?.socialLinks || [];

    return (
        <footer className="bg-dark-950 relative">
            {/* Top divider */}
            <div className="section-divider" />

            <div className="bg-grid">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* About */}
                        <div>
                            <h3 className="text-cyan-400 font-bold text-lg mb-4">{profileName}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                AI/ML Engineer specializing in LLMs, Deep Learning, and Production ML Systems.
                                Building intelligent solutions that make a difference.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-cyan-400 font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-sm">
                                {['About', 'Projects', 'Experience', 'Contact'].map(link => (
                                    <li key={link}>
                                        <a
                                            href={`#${link.toLowerCase()}`}
                                            className="text-gray-500 hover:text-cyan-400 transition-colors relative group"
                                        >
                                            {link}
                                            <span className="absolute bottom-0 left-0 w-0 h-px bg-cyan-400 transition-all duration-300 group-hover:w-full shadow-[0_0_5px_rgba(6,182,212,0.3)]" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Connect */}
                        <div>
                            <h3 className="text-cyan-400 font-semibold mb-4">Connect</h3>
                            {loading ? (
                                <div className="text-sm text-gray-600">Loading...</div>
                            ) : socialLinks.length > 0 ? (
                                <div className="flex gap-4">
                                    {socialLinks.map((link) => (
                                        <a
                                            key={link.id}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-500 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.5)] transition-all duration-300 hover:-translate-y-1"
                                            aria-label={link.platform}
                                        >
                                            <SocialIcon platform={link.icon} className="w-6 h-6" />
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <a
                                    href={`mailto:${profileEmail}`}
                                    className="text-gray-500 hover:text-cyan-400 transition-colors flex items-center gap-2"
                                    aria-label="Email"
                                >
                                    <Mail className="w-6 h-6" />
                                    <span className="text-sm">Get in touch</span>
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="section-divider mt-8 mb-8" />

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
                        <p className="text-gray-600">
                            &copy; {currentYear} {profileName}. All rights reserved.
                        </p>
                        <p className="text-gray-700 font-mono text-xs flex items-center gap-1.5">
                            <Code2 className="w-3.5 h-3.5 text-cyan-500/50" />
                            Built with Next.js &amp; TypeScript
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
