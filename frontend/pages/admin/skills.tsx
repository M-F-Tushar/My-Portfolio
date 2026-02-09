import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';

interface Skill {
    id?: number;
    name: string;
    category: string;
    proficiency: number;
}

export default function SkillsManagement() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newSkill, setNewSkill] = useState({ name: '', category: '', proficiency: 50 });

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const response = await axios.get('/api/admin/skills');
            setSkills(response.data);
        } catch (err) {
            setError('Failed to load skills');
            console.error('Error fetching skills:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/api/admin/skills', newSkill);
            setNewSkill({ name: '', category: '', proficiency: 50 });
            fetchSkills();
        } catch (err) {
            console.error('Error adding skill:', err);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Delete this skill?')) {
            await axios.delete('/api/admin/skills', { data: { id } });
            fetchSkills();
        }
    };

    const categories = [...new Set(skills.map(s => s.category))];

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
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Skills Management</h1>
                        <p className="text-gray-600 mt-2">Manage your technical skills and proficiency levels</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600">{error}</div>
                    )}

                    <form onSubmit={handleAdd} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Skill Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g., PyTorch"
                                    value={newSkill.name}
                                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Machine Learning"
                                    value={newSkill.category}
                                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Proficiency: {newSkill.proficiency}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={newSkill.proficiency}
                                    onChange={(e) => setNewSkill({ ...newSkill, proficiency: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary mt-4 flex items-center space-x-2">
                            <Plus className="w-5 h-5" />
                            <span>Add Skill</span>
                        </button>
                    </form>

                    <div className="space-y-6">
                        {categories.map(category => (
                            <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold mb-4">{category}</h2>
                                <div className="space-y-3">
                                    {skills.filter(s => s.category === category).map(skill => (
                                        <div key={skill.id} className="flex items-center gap-3">
                                            <span className="w-32 text-sm font-medium text-gray-700 shrink-0">{skill.name}</span>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-primary-600 h-2.5 rounded-full transition-all duration-500"
                                                    style={{ width: `${skill.proficiency || 50}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-500 w-10 text-right">{skill.proficiency || 50}%</span>
                                            <button onClick={() => handleDelete(skill.id!)} className="text-red-600 hover:text-red-800 p-1">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}
