import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import axios from 'axios';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface SocialLink {
    id?: number;
    platform: string;
    url: string;
    icon: string;
}

export default function SocialLinksManagement() {
    const [links, setLinks] = useState<SocialLink[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<SocialLink>({ platform: '', url: '', icon: '' });

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        const response = await axios.get('/api/admin/social-links');
        setLinks(response.data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            await axios.put('/api/admin/social-links', { ...formData, id: editingId });
        } else {
            await axios.post('/api/admin/social-links', formData);
        }
        resetForm();
        fetchLinks();
    };

    const handleDelete = async (id: number) => {
        if (confirm('Delete this social link?')) {
            await axios.delete('/api/admin/social-links', { data: { id } });
            fetchLinks();
        }
    };

    const handleEdit = (link: SocialLink) => {
        setFormData(link);
        setEditingId(link.id!);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({ platform: '', url: '', icon: '' });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <ProtectedRoute>
            <AdminLayout>
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 flex justify-between items-center">
                        <h1 className="text-3xl font-bold">Social Links Management</h1>
                        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center space-x-2">
                            {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                            <span>{showForm ? 'Cancel' : 'Add Link'}</span>
                        </button>
                    </div>

                    {showForm && (
                        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 mb-6 space-y-4">
                            <input type="text" placeholder="Platform (e.g., GitHub)" value={formData.platform} onChange={(e) => setFormData({ ...formData, platform: e.target.value })} className="w-full px-4 py-2 border rounded-lg" required />
                            <input type="text" placeholder="URL" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} className="w-full px-4 py-2 border rounded-lg" required />
                            <input type="text" placeholder="Icon name (lucide-react, e.g., Github)" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="w-full px-4 py-2 border rounded-lg" required />
                            <button type="submit" className="btn-primary flex items-center space-x-2">
                                <Save className="w-5 h-5" />
                                <span>{editingId ? 'Update' : 'Create'}</span>
                            </button>
                        </form>
                    )}

                    <div className="space-y-4">
                        {links.map((link) => (
                            <div key={link.id} className="bg-white rounded-xl shadow-sm border p-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold">{link.platform}</h3>
                                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline text-sm">
                                            {link.url}
                                        </a>
                                        <p className="text-sm text-gray-600 mt-1">Icon: {link.icon}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEdit(link)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDelete(link.id!)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
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
