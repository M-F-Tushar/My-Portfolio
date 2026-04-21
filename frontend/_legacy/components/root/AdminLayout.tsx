import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/AuthContext';
import axios from 'axios';
import {
    LayoutDashboard,
    User,
    Briefcase,
    Code,
    GraduationCap,
    Award,
    Share2,
    LogOut,
    Home,
    Menu,
    FileText,
    MessageSquare,
    Mail,
    BadgeCheck,
} from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

interface NavSection {
    label: string;
    items: { name: string; href: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[];
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        axios.get('/api/admin/dashboard-stats')
            .then((res) => {
                setUnreadCount(res.data.contactSubmissions?.unread || 0);
            })
            .catch(() => {});
    }, []);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const navSections: NavSection[] = [
        {
            label: 'Main',
            items: [
                { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
                { name: 'Profile', href: '/admin/profile', icon: User },
            ],
        },
        {
            label: 'Content',
            items: [
                { name: 'Projects', href: '/admin/projects', icon: Briefcase },
                { name: 'Blog Posts', href: '/admin/blog-posts', icon: FileText },
                { name: 'Skills', href: '/admin/skills', icon: Code },
            ],
        },
        {
            label: 'Career',
            items: [
                { name: 'Experience', href: '/admin/experience', icon: Award },
                { name: 'Education', href: '/admin/education', icon: GraduationCap },
                { name: 'Certifications', href: '/admin/certifications', icon: BadgeCheck },
            ],
        },
        {
            label: 'Engage',
            items: [
                { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
                { name: 'Contact Messages', href: '/admin/contact-submissions', icon: Mail, badge: unreadCount },
                { name: 'Social Links', href: '/admin/social-links', icon: Share2 },
            ],
        },
        {
            label: 'Settings',
            items: [
                { name: 'Navigation', href: '/admin/nav', icon: Menu },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg overflow-y-auto">
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b">
                        <h1 className="text-2xl font-bold gradient-text">Admin Panel</h1>
                        <p className="text-sm text-gray-600 mt-1">Welcome, {user?.username}</p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-4">
                        {navSections.map((section) => (
                            <div key={section.label}>
                                <p className="px-4 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    {section.label}
                                </p>
                                <div className="space-y-0.5">
                                    {section.items.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = router.pathname === item.href;

                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={`group flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-300 ${isActive
                                                    ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-600 shadow-sm'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:translate-x-1'
                                                    }`}
                                            >
                                                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-6'}`} />
                                                <span className="font-medium text-sm">{item.name}</span>
                                                {item.badge && item.badge > 0 ? (
                                                    <span className="ml-auto px-1.5 py-0.5 bg-red-500 text-white text-xs font-medium rounded-full min-w-[20px] text-center">
                                                        {item.badge}
                                                    </span>
                                                ) : isActive ? (
                                                    <div className="ml-auto w-1 h-5 bg-primary-600 rounded-full animate-pulse"></div>
                                                ) : null}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t space-y-2">
                        <Link
                            href="/"
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-300 hover:translate-x-1 group"
                        >
                            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">View Site</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-300 hover:translate-x-1 group"
                        >
                            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-8 pb-24">
                {children}
            </main>
        </div>
    );
}
