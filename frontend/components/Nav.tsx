import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Shield } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import axios from 'axios';

export default function Nav() {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();
    const [profileName, setProfileName] = useState('Portfolio');
    const [scrolled, setScrolled] = useState(false);
    const [navItems, setNavItems] = useState<Array<{ label: string; href: string }>>([]);

    useEffect(() => {
        // Fetch profile name
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
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        setIsOpen(false);

        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
            ? 'glass shadow-lg'
            : 'bg-white shadow-sm'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold gradient-text">
                        {profileName}
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={(e) => handleClick(e, item.href)}
                                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                            >
                                {item.label}
                            </a>
                        ))}
                        {user && (
                            <Link
                                href="/admin"
                                className="text-primary-600 hover:text-primary-700 transition-colors font-medium flex items-center space-x-1"
                            >
                                <Shield className="w-4 h-4" />
                                <span>Admin</span>
                            </Link>
                        )}
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
                <div className="md:hidden bg-white border-t">
                    <div className="px-4 py-4 space-y-3">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={(e) => handleClick(e, item.href)}
                                className="block text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
                            >
                                {item.label}
                            </a>
                        ))}
                        {user && (
                            <Link
                                href="/admin"
                                className="block text-primary-600 hover:text-primary-700 transition-colors font-medium py-2 flex items-center space-x-1"
                            >
                                <Shield className="w-4 h-4" />
                                <span>Admin</span>
                            </Link>
                        )}
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
