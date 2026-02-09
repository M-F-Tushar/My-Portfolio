import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import axios from 'axios';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import ImageUpload from '@/components/admin/ImageUpload';

interface BlogPost {
    id?: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    tags: string;
    published: boolean;
    publishedAt?: string;
    readTime: number;
}

function tagsJsonToComma(json: string): string {
    try {
        const arr = JSON.parse(json);
        if (Array.isArray(arr)) return arr.join(', ');
    } catch {}
    return json;
}

function tagsCommaToJson(csv: string): string {
    const arr = csv.split(',').map((t) => t.trim()).filter(Boolean);
    return JSON.stringify(arr);
}

export default function BlogPostsManagement() {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<BlogPost>({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        coverImage: '',
        tags: '',
        published: false,
        readTime: 1
    });

    useEffect(() => {
        fetchBlogPosts();
    }, []);

    const fetchBlogPosts = async () => {
        try {
            const response = await axios.get('/api/admin/blog-posts');
            setBlogPosts(response.data);
        } catch (error) {
            console.error('Error fetching blog posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...formData,
            tags: tagsCommaToJson(formData.tags),
            readTime: Math.max(1, Math.ceil(formData.content.split(/\s+/).filter(Boolean).length / 200))
        };

        try {
            if (editingId) {
                await axios.put('/api/admin/blog-posts', { ...payload, id: editingId });
            } else {
                await axios.post('/api/admin/blog-posts', payload);
            }

            fetchBlogPosts();
            resetForm();
        } catch (error) {
            console.error('Error saving blog post:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;

        try {
            await axios.delete('/api/admin/blog-posts', { data: { id } });
            fetchBlogPosts();
        } catch (error) {
            console.error('Error deleting blog post:', error);
        }
    };

    const handleEdit = (post: BlogPost) => {
        setFormData({
            ...post,
            tags: tagsJsonToComma(post.tags)
        });
        setEditingId(post.id!);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            coverImage: '',
            tags: '',
            published: false,
            readTime: 1
        });
        setEditingId(null);
        setShowForm(false);
    };

    const estimatedReadTime = Math.max(1, Math.ceil(formData.content.split(/\s+/).filter(Boolean).length / 200));

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
                            <h1 className="text-3xl font-bold text-gray-900">Blog Posts Management</h1>
                            <p className="text-gray-600 mt-2">Manage your blog posts</p>
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="btn-primary flex items-center space-x-2"
                        >
                            {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                            <span>{showForm ? 'Cancel' : 'Add Blog Post'}</span>
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

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Excerpt (Short summary)</label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                />
                            </div>

                            <div>
                                <MarkdownEditor
                                    label="Content"
                                    value={formData.content}
                                    onChange={(value) => setFormData({ ...formData, content: value })}
                                    placeholder="Write your blog post content in markdown..."
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Estimated read time: {estimatedReadTime} min
                                </p>
                            </div>

                            <div>
                                <ImageUpload
                                    label="Cover Image"
                                    value={formData.coverImage}
                                    onChange={(url) => setFormData({ ...formData, coverImage: url })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags (comma-separated)</label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="React, TypeScript, Next.js"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.published}
                                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                />
                                <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Published</label>
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

                    {/* Blog Posts List */}
                    <div className="space-y-4">
                        {blogPosts.map((post) => (
                            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
                                            {post.published ? (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Published</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">Draft</span>
                                            )}
                                        </div>
                                        {post.excerpt && (
                                            <p className="text-gray-600 mt-2">
                                                {post.excerpt.length > 150 ? post.excerpt.substring(0, 150) + '...' : post.excerpt}
                                            </p>
                                        )}
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {JSON.parse(post.tags || '[]').map((tag: string, idx: number) => (
                                                <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="mt-2 text-sm text-gray-500">
                                            {post.readTime} min read
                                            {post.publishedAt && (
                                                <span> &middot; {new Date(post.publishedAt).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 ml-4">
                                        <button
                                            onClick={() => handleEdit(post)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.id!)}
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
