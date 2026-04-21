import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/lib/AuthContext';
import {
    Briefcase,
    FileText,
    MessageSquare,
    Mail,
    Plus,
    Eye,
    User,
} from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

interface DashboardStats {
    projects: number;
    skills: number;
    experience: number;
    education: number;
    blogPosts: number;
    publishedBlogPosts: number;
    testimonials: number;
    certifications: number;
    contactSubmissions: { total: number; unread: number };
    recentSubmissions: Array<{
        id: number;
        name: string;
        email: string;
        message: string;
        read: boolean;
        createdAt: string;
    }>;
}

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/admin/dashboard-stats')
            .then((res) => setStats(res.data))
            .catch((err) => console.error('Error fetching stats:', err))
            .finally(() => setLoading(false));
    }, []);

    const statCards = stats ? [
        { label: 'Projects', value: stats.projects, href: '/admin/projects', icon: Briefcase, color: 'bg-blue-500' },
        { label: 'Blog Posts', value: `${stats.publishedBlogPosts}/${stats.blogPosts}`, href: '/admin/blog-posts', icon: FileText, color: 'bg-green-500' },
        { label: 'Testimonials', value: stats.testimonials, href: '/admin/testimonials', icon: MessageSquare, color: 'bg-purple-500' },
        { label: 'Unread Messages', value: stats.contactSubmissions.unread, href: '/admin/contact-submissions', icon: Mail, color: stats.contactSubmissions.unread > 0 ? 'bg-red-500' : 'bg-gray-400' },
    ] : [];

    const quickActions = [
        { label: 'New Blog Post', href: '/admin/blog-posts', icon: Plus, color: 'text-green-600 bg-green-50 hover:bg-green-100' },
        { label: 'New Project', href: '/admin/projects', icon: Plus, color: 'text-blue-600 bg-blue-50 hover:bg-blue-100' },
        { label: 'View Messages', href: '/admin/contact-submissions', icon: Eye, color: 'text-purple-600 bg-purple-50 hover:bg-purple-100' },
        { label: 'Edit Profile', href: '/admin/profile', icon: User, color: 'text-orange-600 bg-orange-50 hover:bg-orange-100' },
    ];

    return (
        <ProtectedRoute>
            <AdminLayout>
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600 mt-2">Welcome back, {user?.username}! Here&apos;s an overview of your portfolio.</p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                    ) : (
                        <>
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {statCards.map((card) => {
                                    const Icon = card.icon;
                                    return (
                                        <Link
                                            key={card.label}
                                            href={card.href}
                                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-500">{card.label}</p>
                                                    <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                                                </div>
                                                <div className={`${card.color} p-3 rounded-lg`}>
                                                    <Icon className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Quick Actions */}
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                                <div className="flex flex-wrap gap-3">
                                    {quickActions.map((action) => {
                                        const Icon = action.icon;
                                        return (
                                            <Link
                                                key={action.label}
                                                href={action.href}
                                                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${action.color}`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                {action.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Recent Activity */}
                            {stats && stats.recentSubmissions.length > 0 && (
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Contact Messages</h2>
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
                                        {stats.recentSubmissions.map((sub) => (
                                            <div key={sub.id} className="p-4 flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-gray-900">{sub.name}</p>
                                                        {!sub.read && (
                                                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">New</span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-500">{sub.email}</p>
                                                    <p className="text-sm text-gray-600 mt-1 truncate">{sub.message}</p>
                                                </div>
                                                <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                                                    {new Date(sub.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <Link
                                        href="/admin/contact-submissions"
                                        className="inline-block mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium"
                                    >
                                        View all messages →
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}
