import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import axios from 'axios';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface Project {
    id?: number;
    title: string;
    slug?: string;
    description: string;
    content?: string;
    imageUrl?: string;
    demoUrl?: string;
    repoUrl?: string;
    techStack: string;
    featured: boolean;
}

export default function ProjectsManagement() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<Project>({
        title: '',
        slug: '',
        description: '',
        content: '',
        imageUrl: '',
        demoUrl: '',
        repoUrl: '',
        techStack: '',
        featured: false
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('/api/admin/projects');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingId) {
                await axios.put('/api/admin/projects', { ...formData, id: editingId });
            } else {
                await axios.post('/api/admin/projects', formData);
            }

            fetchProjects();
            resetForm();
        } catch (error) {
            console.error('Error saving project:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            await axios.delete('/api/admin/projects', { data: { id } });
            fetchProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const handleEdit = (project: Project) => {
        setFormData(project);
        setEditingId(project.id!);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            slug: '',
            description: '',
            content: '',
            imageUrl: '',
            demoUrl: '',
            repoUrl: '',
            techStack: '',
            featured: false
        });
        setEditingId(null);
        setShowForm(false);
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
                            <h1 className="text-3xl font-bold text-gray-900">Projects Management</h1>
                            <p className="text-gray-600 mt-2">Manage your portfolio projects</p>
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="btn-primary flex items-center space-x-2"
                        >
                            {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                            <span>{showForm ? 'Cancel' : 'Add Project'}</span>
                        </button>
                    </div>

                    {/* Form */}
                    {showForm && (
                        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Slug (URL-friendly)</label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="auto-generated from title if empty"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate from title</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tech Stack (JSON array)</label>
                                    <input
                                        type="text"
                                        value={formData.techStack}
                                        onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder='["React", "Node.js"]'
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description (Short summary)</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content (Markdown - detailed project description)</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    rows={10}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                                    placeholder="# Project Overview&#10;&#10;Detailed markdown content for the project detail page..."
                                />
                                <p className="text-xs text-gray-500 mt-1">Supports Markdown formatting. Leave empty for basic display.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
                                    <input
                                        type="text"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Demo URL</label>
                                    <input
                                        type="text"
                                        value={formData.demoUrl}
                                        onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Repo URL</label>
                                    <input
                                        type="text"
                                        value={formData.repoUrl}
                                        onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                />
                                <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Featured Project</label>
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

                    {/* Projects List */}
                    <div className="space-y-4">
                        {projects.map((project) => (
                            <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                                            {project.featured && (
                                                <span className="px-2 py-1 bg-primary-100 text-primary-600 text-xs font-medium rounded">Featured</span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 mt-2">{project.description}</p>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {JSON.parse(project.techStack || '[]').map((tech: string, idx: number) => (
                                                <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 ml-4">
                                        <button
                                            onClick={() => handleEdit(project)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project.id!)}
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
