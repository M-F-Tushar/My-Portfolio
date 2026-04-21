import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import axios from 'axios';
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff, GripVertical } from 'lucide-react';

interface NavItem {
    id?: number;
    label: string;
    href: string;
    order: number;
    visible: boolean;
}

export default function NavItemsManagement() {
    const [navItems, setNavItems] = useState<NavItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<NavItem>({
        label: '',
        href: '',
        order: 0,
        visible: true
    });

    useEffect(() => {
        fetchNavItems();
    }, []);

    const fetchNavItems = async () => {
        try {
            const response = await axios.get('/api/admin/nav-items');
            setNavItems(response.data);
        } catch (error) {
            console.error('Error fetching nav items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingId) {
                await axios.put('/api/admin/nav-items', { ...formData, id: editingId });
            } else {
                // Set order to be last
                const maxOrder = Math.max(...navItems.map(item => item.order), 0);
                await axios.post('/api/admin/nav-items', { ...formData, order: maxOrder + 1 });
            }

            fetchNavItems();
            resetForm();
        } catch (error) {
            console.error('Error saving nav item:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this navigation item?')) return;

        try {
            await axios.delete('/api/admin/nav-items', { data: { id } });
            fetchNavItems();
        } catch (error) {
            console.error('Error deleting nav item:', error);
        }
    };

    const handleEdit = (item: NavItem) => {
        setFormData(item);
        setEditingId(item.id!);
        setShowForm(true);
    };

    const toggleVisibility = async (item: NavItem) => {
        try {
            await axios.put('/api/admin/nav-items', { ...item, visible: !item.visible });
            fetchNavItems();
        } catch (error) {
            console.error('Error toggling visibility:', error);
        }
    };

    const moveItem = async (index: number, direction: 'up' | 'down') => {
        const newItems = [...navItems];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newItems.length) return;

        // Swap items
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

        // Update order values
        newItems.forEach((item, idx) => {
            item.order = idx;
        });

        setNavItems(newItems);

        // Save to backend
        try {
            await Promise.all(
                newItems.map(item => axios.put('/api/admin/nav-items', item))
            );
        } catch (error) {
            console.error('Error reordering nav items:', error);
            fetchNavItems(); // Revert on error
        }
    };

    const resetForm = () => {
        setFormData({
            label: '',
            href: '',
            order: 0,
            visible: true
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
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Navigation Management</h1>
                            <p className="text-gray-600 mt-2">Manage your site navigation menu items</p>
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="btn-primary flex items-center space-x-2"
                        >
                            {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                            <span>{showForm ? 'Cancel' : 'Add Nav Item'}</span>
                        </button>
                    </div>

                    {/* Form */}
                    {showForm && (
                        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Label</label>
                                    <input
                                        type="text"
                                        value={formData.label}
                                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="About"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Link (href)</label>
                                    <input
                                        type="text"
                                        value={formData.href}
                                        onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="#about"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.visible}
                                    onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                />
                                <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Visible in navigation</label>
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

                    {/* Nav Items List */}
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600 mb-4">
                            Use the arrows to reorder items. The order here determines the order in the navigation menu.
                        </p>
                        {navItems.map((item, index) => (
                            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4 flex-1">
                                        <div className="flex flex-col space-y-1">
                                            <button
                                                onClick={() => moveItem(index, 'up')}
                                                disabled={index === 0}
                                                className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                ▲
                                            </button>
                                            <button
                                                onClick={() => moveItem(index, 'down')}
                                                disabled={index === navItems.length - 1}
                                                className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                ▼
                                            </button>
                                        </div>
                                        <GripVertical className="w-5 h-5 text-gray-400" />
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{item.label}</h3>
                                                {!item.visible && (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">Hidden</span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 text-sm">{item.href}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => toggleVisibility(item)}
                                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                                            title={item.visible ? 'Hide' : 'Show'}
                                        >
                                            {item.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                        </button>
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id!)}
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
