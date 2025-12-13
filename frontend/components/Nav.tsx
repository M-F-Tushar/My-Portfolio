'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Shield } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/lib/AuthContext';
import { useActiveSection } from '@/hooks/useActiveSection';
import axios from 'axios';

const ThemeToggle = dynamic(() => import('./ThemeToggle'), { ssr: false });

export default function Nav() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { user } = useAuth();
    const [profileName, setProfileName] = useState('Portfolio');
    const [scrolled, setScrolled] = useState(false);
    const [navItems, setNavItems] = useState<Array<{ label: string; href: string }>>([]);

    // Track active section for navigation highlighting
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

        // Fetch navigation items
        axios.get('/api/nav-items')
            .then(res => setNavItems(res.data || []))
            .catch(() => {
                // Fallback to default nav items if API fails
                setNavItems([
                    { label: 'About', href: '#about' },
                    { label: 'Skills', href: '#skills' },
                    { label: 'Experience', href: '#experience' },
                    { label: 'Projects', href: '#projects' },
                    { label: 'Education', href: '#education' },
                    { label: 'Contact', href: '#contact' },
                ]);
            });

        // Handle scroll for glassmorphism effect
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
            <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="text-2xl font-bold gradient-text">Portfolio</div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
            ? 'glass dark:bg-gray-900/80 shadow-lg'
            : 'bg-white dark:bg-gray-900 shadow-sm'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold gradient-text">
                        {profileName}
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navItems.map((item) => {
                            const sectionId = item.href.startsWith('#') ? item.href.slice(1) : '';
                            const isActive = sectionId === activeSection;

                            return (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={(e) => handleClick(e, item.href)}
                                    className={`relative py-1 transition-colors font-medium ${isActive
                                            ? 'text-primary-600 dark:text-primary-400'
                                            : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                                        }`}
                                >
                                    {item.label}
                                    {/* Active indicator */}
                                    <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary-600 dark:bg-primary-400 transform transition-transform origin-left ${isActive ? 'scale-x-100' : 'scale-x-0'
                                        }`} />
                                </a>
                            );
                        })}
                        {user && (
                            <Link
                                href="/admin"
                                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors font-medium flex items-center space-x-1"
                            >
                                <Shield className="w-4 h-4" />
                                <span>Admin</span>
                            </Link>
                        )}

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        <a
                            href="/resume.pdf"
                            className="btn-primary text-sm"
                        >
                            Resume
                        </a>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800">
                    <div className="px-4 py-4 space-y-3">
                        {navItems.map((item) => {
                            const sectionId = item.href.startsWith('#') ? item.href.slice(1) : '';
                            const isActive = sectionId === activeSection;

                            return (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={(e) => handleClick(e, item.href)}
                                    className={`block transition-colors font-medium py-2 ${isActive
                                            ? 'text-primary-600 dark:text-primary-400 border-l-2 border-primary-600 pl-3'
                                            : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                                        }`}
                                >
                                    {item.label}
                                </a>
                            );
                        })}
                        {user && (
                            <Link
                                href="/admin"
                                className="block text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors font-medium py-2 flex items-center space-x-1"
                            >
                                <Shield className="w-4 h-4" />
                                <span>Admin</span>
                            </Link>
                        )}

                        <div className="flex items-center justify-between py-2 border-t dark:border-gray-800">
                            <span className="text-gray-600 dark:text-gray-400">Theme</span>
                            <ThemeToggle />
                        </div>

                        <a
                            href="/resume.pdf"
                            className="block btn-primary text-center"
                        >
                            Download Resume
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}
