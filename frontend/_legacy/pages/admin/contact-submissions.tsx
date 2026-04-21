import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import axios from 'axios';
import { Mail, Eye, EyeOff, Trash2 } from 'lucide-react';

interface ContactSubmission {
    id: number;
    name: string;
    email: string;
    message: string;
    read: boolean;
    createdAt: string;
}

type Filter = 'all' | 'unread' | 'read';

export default function ContactSubmissionsManagement() {
    const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<Filter>('all');
    const [expandedId, setExpandedId] = useState<number | null>(null);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const response = await axios.get('/api/admin/contact-submissions');
            setSubmissions(response.data);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleRead = async (submission: ContactSubmission) => {
        try {
            await axios.put('/api/admin/contact-submissions', {
                id: submission.id,
                read: !submission.read,
            });
            fetchSubmissions();
        } catch (error) {
            console.error('Error updating submission:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this submission?')) return;
        try {
            await axios.delete('/api/admin/contact-submissions', { data: { id } });
            fetchSubmissions();
        } catch (error) {
            console.error('Error deleting submission:', error);
        }
    };

    const filtered = submissions.filter((s) => {
        if (filter === 'unread') return !s.read;
        if (filter === 'read') return s.read;
        return true;
    });

    const unreadCount = submissions.filter((s) => !s.read).length;

    if (loading) {
        return (
            <ProtectedRoute>
                <AdminLayout>
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                </AdminLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <AdminLayout>
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
                            {unreadCount > 0 && (
                                <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                                    {unreadCount} unread
                                </span>
                            )}
                        </div>
                        <p className="text-gray-600 mt-2">View and manage contact form submissions</p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 mb-6">
                        {(['all', 'unread', 'read'] as Filter[]).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    filter === f
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                                {f === 'unread' && unreadCount > 0 && (
                                    <span className="ml-1.5 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Submissions List */}
                    <div className="space-y-4">
                        {filtered.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                {filter === 'all' ? 'No contact submissions yet.' : `No ${filter} messages.`}
                            </div>
                        )}
                        {filtered.map((submission) => (
                            <div
                                key={submission.id}
                                className={`bg-white rounded-xl shadow-sm border p-6 transition-colors ${
                                    submission.read ? 'border-gray-200' : 'border-primary-200 bg-primary-50/30'
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-semibold text-gray-900">{submission.name}</h3>
                                            {!submission.read && (
                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                                    New
                                                </span>
                                            )}
                                        </div>
                                        <a
                                            href={`mailto:${submission.email}`}
                                            className="text-primary-600 hover:text-primary-700 text-sm mt-1 inline-block"
                                        >
                                            {submission.email}
                                        </a>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(submission.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>

                                        {/* Message */}
                                        <div className="mt-3">
                                            <p className="text-gray-700 whitespace-pre-wrap">
                                                {expandedId === submission.id
                                                    ? submission.message
                                                    : submission.message.length > 200
                                                    ? submission.message.substring(0, 200) + '...'
                                                    : submission.message}
                                            </p>
                                            {submission.message.length > 200 && (
                                                <button
                                                    onClick={() => setExpandedId(expandedId === submission.id ? null : submission.id)}
                                                    className="text-primary-600 hover:text-primary-700 text-sm mt-1"
                                                >
                                                    {expandedId === submission.id ? 'Show less' : 'Read more'}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex space-x-2 ml-4">
                                        <button
                                            onClick={() => toggleRead(submission)}
                                            className={`p-2 rounded-lg ${
                                                submission.read
                                                    ? 'text-gray-400 hover:bg-gray-50'
                                                    : 'text-blue-600 hover:bg-blue-50'
                                            }`}
                                            title={submission.read ? 'Mark as unread' : 'Mark as read'}
                                        >
                                            {submission.read ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(submission.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}
