import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';
import axios from 'axios';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface Testimonial {
    id?: number;
    name: string;
    role: string;
    company: string;
    content: string;
    avatarUrl: string;
    linkedinUrl: string;
    featured: boolean;
    order: number;
}

export default function TestimonialsManagement() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<Testimonial>({
        name: '',
        role: '',
        company: '',
        content: '',
        avatarUrl: '',
        linkedinUrl: '',
        featured: false,
        order: 0
    });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const response = await axios.get('/api/admin/testimonials');
            setTestimonials(response.data);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingId) {
                await axios.put('/api/admin/testimonials', { ...formData, id: editingId });
            } else {
                await axios.post('/api/admin/testimonials', formData);
            }

            fetchTestimonials();
            resetForm();
        } catch (error) {
            console.error('Error saving testimonial:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;

        try {
            await axios.delete('/api/admin/testimonials', { data: { id } });
            fetchTestimonials();
        } catch (error) {
            console.error('Error deleting testimonial:', error);
        }
    };

    const handleEdit = (testimonial: Testimonial) => {
        setFormData(testimonial);
        setEditingId(testimonial.id!);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            role: '',
            company: '',
            content: '',
            avatarUrl: '',
            linkedinUrl: '',
            featured: false,
            order: 0
        });
        setEditingId(null);
        setShowForm(false);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

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
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Testimonials Management</h1>
                            <p className="text-gray-600 mt-2">Manage your client testimonials</p>
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="btn-primary flex items-center space-x-2"
                        >
                            {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                            <span>{showForm ? 'Cancel' : 'Add Testimonial'}</span>
                        </button>
                    </div>

                    {/* Form */}
                    {showForm && (
                        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company</label>
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">LinkedIn URL</label>
                                    <input
                                        type="text"
                                        value={formData.linkedinUrl}
                                        onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    required
                                />
                            </div>

                            <div>
                                <ImageUpload
                                    value={formData.avatarUrl}
                                    onChange={(url) => setFormData({ ...formData, avatarUrl: url })}
                                    label="Avatar"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.featured}
                                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                    />
                                    <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Featured Testimonial</label>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Order</label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={resetForm} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary flex items-center space-x-2">
                                    <Save className="w-5 h-5" />
                                    <span>{editingId ? 'Update' : 'Create'}</span>
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Testimonials List */}
                    <div className="space-y-4">
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start space-x-4 flex-1">
                                        {testimonial.avatarUrl ? (
                                            <img
                                                src={testimonial.avatarUrl}
                                                alt={testimonial.name}
                                                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                                                {getInitials(testimonial.name)}
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <h3 className="text-xl font-semibold text-gray-900">{testimonial.name}</h3>
                                                {testimonial.featured && (
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Featured</span>
                                                )}
                                            </div>
                                            <p className="text-gray-500 text-sm">{testimonial.role} @ {testimonial.company}</p>
                                            <p className="text-gray-600 mt-2">
                                                {testimonial.content.length > 100
                                                    ? testimonial.content.substring(0, 100) + '...'
                                                    : testimonial.content}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 ml-4">
                                        <button
                                            onClick={() => handleEdit(testimonial)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(testimonial.id!)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
