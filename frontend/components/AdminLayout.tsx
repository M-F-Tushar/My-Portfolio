import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/AuthContext';
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
    Menu
} from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Profile', href: '/admin/profile', icon: User },
        { name: 'Navigation', href: '/admin/nav', icon: Menu },
        { name: 'Projects', href: '/admin/projects', icon: Briefcase },
        { name: 'Skills', href: '/admin/skills', icon: Code },
        { name: 'Experience', href: '/admin/experience', icon: Award },
        { name: 'Education', href: '/admin/education', icon: GraduationCap },
        { name: 'Social Links', href: '/admin/social-links', icon: Share2 },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b">
                        <h1 className="text-2xl font-bold gradient-text">Admin Panel</h1>
                        <p className="text-sm text-gray-600 mt-1">Welcome, {user?.username}</p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = router.pathname === item.href;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive
                                        ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-600 shadow-sm'
                                        : 'text-gray-700 hover:bg-gray-50 hover:translate-x-1'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-6'}`} />
                                    <span className="font-medium">{item.name}</span>
                                    {isActive && (
                                        <div className="ml-auto w-1 h-6 bg-primary-600 rounded-full animate-pulse"></div>
                                    )}
                                </Link>
                            );
                        })}
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
