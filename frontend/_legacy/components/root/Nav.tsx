'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { useActiveSection } from '@/hooks/useActiveSection';
import axios from 'axios';

export default function Nav() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { user } = useAuth();
    const [profileName, setProfileName] = useState('Portfolio');
    const [scrolled, setScrolled] = useState(false);
    const [navItems, setNavItems] = useState<Array<{ label: string; href: string }>>([]);

    const sectionIds = navItems
        .filter(item => item.href.startsWith('#'))
        .map(item => item.href.slice(1));
    const activeSection = useActiveSection({ sections: sectionIds });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        axios.get('/api/profile/name')
            .then(res => setProfileName(res.data.name || 'Portfolio'))
            .catch(() => setProfileName('Portfolio'));

        axios.get('/api/nav-items')
            .then(res => setNavItems(res.data || []))
            .catch(() => {
                setNavItems([
                    { label: 'About', href: '#about' },
                    { label: 'Skills', href: '#skills' },
                    { label: 'Experience', href: '#experience' },
                    { label: 'Projects', href: '#projects' },
                    { label: 'Education', href: '#education' },
                    { label: 'Contact', href: '#contact' },
                ]);
            });

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [mounted]);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        setIsOpen(false);

        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (!mounted) {
        return (
            <nav className="sticky top-0 z-50 bg-dark-900/70 backdrop-blur-xl border-b border-cyan-500/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="text-2xl font-bold gradient-text">Portfolio</div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-500 ${
                scrolled
                    ? 'bg-dark-900/90 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                    : 'bg-dark-900/70 backdrop-blur-xl border-b border-cyan-500/10'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold gradient-text">
                        {profileName}
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => {
                            const sectionId = item.href.startsWith('#') ? item.href.slice(1) : '';
                            const isActive = sectionId === activeSection;

                            return (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={(e) => handleClick(e, item.href)}
                                    className={`relative py-1 transition-colors duration-300 text-sm font-medium ${
                                        isActive
                                            ? 'text-cyan-400'
                                            : 'text-gray-400 hover:text-cyan-400'
                                    }`}
                                >
                                    {item.label}
                                    <span
                                        className={`absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)] transform transition-transform duration-300 origin-left ${
                                            isActive ? 'scale-x-100' : 'scale-x-0'
                                        }`}
                                    />
                                </a>
                            );
                        })}
                        {user && (
                            <Link
                                href="/admin"
                                className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium flex items-center space-x-1 text-sm"
                            >
                                <Shield className="w-4 h-4" />
                                <span>Admin</span>
                            </Link>
                        )}

                        <a href="/resume.pdf" className="btn-primary text-sm">
                            Resume
                        </a>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-white/5 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden overflow-hidden bg-dark-800/95 backdrop-blur-xl border-t border-cyan-500/10"
                    >
                        <div className="px-4 py-4 space-y-1">
                            {navItems.map((item) => {
                                const sectionId = item.href.startsWith('#') ? item.href.slice(1) : '';
                                const isActive = sectionId === activeSection;

                                return (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        onClick={(e) => handleClick(e, item.href)}
                                        className={`block py-3 px-3 rounded-lg transition-colors font-medium ${
                                            isActive
                                                ? 'text-cyan-400 bg-cyan-500/10 border-l-2 border-cyan-400'
                                                : 'text-gray-400 hover:text-cyan-400 hover:bg-white/5'
                                        }`}
                                    >
                                        {item.label}
                                    </a>
                                );
                            })}
                            {user && (
                                <Link
                                    href="/admin"
                                    className="block text-cyan-400 hover:text-cyan-300 transition-colors font-medium py-3 px-3 flex items-center space-x-2"
                                >
                                    <Shield className="w-4 h-4" />
                                    <span>Admin</span>
                                </Link>
                            )}

                            <div className="pt-2">
                                <a
                                    href="/resume.pdf"
                                    className="block btn-primary text-center text-sm"
                                >
                                    Download Resume
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
