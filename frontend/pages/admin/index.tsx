import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/lib/AuthContext';
import { LayoutDashboard, User, Briefcase, Code, Award, GraduationCap, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        projects: 0,
        skills: 0,
        experience: 0,
        education: 0
    });

    const quickLinks = [
        { name: 'Profile', href: '/admin/profile', icon: User, color: 'bg-blue-500' },
        { name: 'Projects', href: '/admin/projects', icon: Briefcase, color: 'bg-green-500' },
        { name: 'Skills', href: '/admin/skills', icon: Code, color: 'bg-purple-500' },
        { name: 'Experience', href: '/admin/experience', icon: Award, color: 'bg-orange-500' },
        { name: 'Education', href: '/admin/education', icon: GraduationCap, color: 'bg-pink-500' },
        { name: 'Social Links', href: '/admin/social-links', icon: Share2, color: 'bg-indigo-500' },
    ];

    return (
        <ProtectedRoute>
            <AdminLayout>
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600 mt-2">Welcome back, {user?.username}! Manage your portfolio content below.</p>
                    </div>

                    {/* Quick Links Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quickLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:-translate-y-2 hover:border-primary-200"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={`${link.color} p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{link.name}</h3>
                                            <p className="text-sm text-gray-600">Manage {link.name.toLowerCase()}</p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Info Card */}
                    <div className="mt-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg p-6 text-white">
                        <h2 className="text-2xl font-bold mb-2">Getting Started</h2>
                        <p className="text-primary-100 mb-4">
                            Use the navigation menu on the left or the quick links above to manage your portfolio content.
                            All changes are saved to the database and will be reflected on your public portfolio immediately.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="/admin/profile" className="bg-white text-primary-600 px-6 py-2 rounded-lg font-medium hover:bg-primary-50 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                Edit Profile
                            </Link>
                            <Link href="/" className="bg-primary-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-800 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                View Site
                            </Link>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}
