import { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Twitter, ExternalLink } from 'lucide-react';

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

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Github': return <Github className="w-6 h-6" />;
            case 'Linkedin': return <Linkedin className="w-6 h-6" />;
            case 'Mail': return <Mail className="w-6 h-6" />;
            case 'Twitter': return <Twitter className="w-6 h-6" />;
            default: return <ExternalLink className="w-6 h-6" />;
        }
    };

    // Fallback values while loading or if data fetch fails
    const profileName = footerData?.profile?.name || 'AI/ML Engineer';
    const profileEmail = footerData?.profile?.email || 'contact@example.com';
    const socialLinks = footerData?.socialLinks || [];

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">{profileName}</h3>
                        <p className="text-sm">
                            AI/ML Engineer specializing in LLMs, Deep Learning, and Production ML Systems.
                            Building intelligent solutions that make a difference.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#about" className="hover:text-white transition-colors relative group">
                                    About
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                                </a>
                            </li>
                            <li>
                                <a href="#projects" className="hover:text-white transition-colors relative group">
                                    Projects
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                                </a>
                            </li>
                            <li>
                                <a href="#experience" className="hover:text-white transition-colors relative group">
                                    Experience
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                                </a>
                            </li>
                            <li>
                                <a href="#contact" className="hover:text-white transition-colors relative group">
                                    Contact
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Connect</h3>
                        {loading ? (
                            <div className="text-sm text-gray-400">Loading...</div>
                        ) : socialLinks.length > 0 ? (
                            <div className="flex gap-4">
                                {socialLinks.map((link) => (
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-white transition-all duration-300 hover:-translate-y-1 hover:scale-110"
                                        aria-label={link.platform}
                                    >
                                        {getIcon(link.icon)}
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <a
                                href={`mailto:${profileEmail}`}
                                className="hover:text-white transition-colors flex items-center gap-2"
                                aria-label="Email"
                            >
                                <Mail className="w-6 h-6" />
                                <span className="text-sm">Get in touch</span>
                            </a>
                        )}
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
                    <p>© {currentYear} {profileName}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
