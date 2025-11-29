import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import axios from 'axios';
import { Plus, Trash2, Save } from 'lucide-react';

interface Skill {
    id?: number;
    name: string;
    category: string;
}

export default function SkillsManagement() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [newSkill, setNewSkill] = useState({ name: '', category: '' });

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        const response = await axios.get('/api/admin/skills');
        setSkills(response.data);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        await axios.post('/api/admin/skills', newSkill);
        setNewSkill({ name: '', category: '' });
        fetchSkills();
    };

    const handleDelete = async (id: number) => {
        if (confirm('Delete this skill?')) {
            await axios.delete('/api/admin/skills', { data: { id } });
            fetchSkills();
        }
    };

    const categories = [...new Set(skills.map(s => s.category))];

    return (
        <ProtectedRoute>
            <AdminLayout>
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Skills Management</h1>

                    <form onSubmit={handleAdd} className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Skill name"
                                value={newSkill.name}
                                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                className="px-4 py-2 border rounded-lg"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Category"
                                value={newSkill.category}
                                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                                className="px-4 py-2 border rounded-lg"
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary mt-4 flex items-center space-x-2">
                            <Plus className="w-5 h-5" />
                            <span>Add Skill</span>
                        </button>
                    </form>

                    <div className="space-y-6">
                        {categories.map(category => (
                            <div key={category} className="bg-white rounded-xl shadow-sm border p-6">
                                <h2 className="text-xl font-semibold mb-4">{category}</h2>
                                <div className="flex flex-wrap gap-2">
                                    {skills.filter(s => s.category === category).map(skill => (
                                        <div key={skill.id} className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full">
                                            <span>{skill.name}</span>
                                            <button onClick={() => handleDelete(skill.id!)} className="text-red-600 hover:text-red-800">
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
