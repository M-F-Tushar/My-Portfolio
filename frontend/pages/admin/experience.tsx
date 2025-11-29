import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import axios from 'axios';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface Experience {
    id?: number;
    company: string;
    role: string;
    period: string;
    description?: string;
    achievements: string;
    techStack: string;
}

export default function ExperienceManagement() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<Experience>({
        company: '',
        role: '',
        period: '',
        description: '',
        achievements: '[]',
        techStack: '[]'
    });

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        const response = await axios.get('/api/admin/experience');
        setExperiences(response.data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            await axios.put('/api/admin/experience', { ...formData, id: editingId });
        } else {
            await axios.post('/api/admin/experience', formData);
        }
        resetForm();
        fetchExperiences();
    };

    const handleDelete = async (id: number) => {
        if (confirm('Delete this experience?')) {
            await axios.delete('/api/admin/experience', { data: { id } });
            fetchExperiences();
        }
    };

    const handleEdit = (exp: Experience) => {
        setFormData(exp);
        setEditingId(exp.id!);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({ company: '', role: '', period: '', description: '', achievements: '[]', techStack: '[]' });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <ProtectedRoute>
            <AdminLayout>
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 flex justify-between items-center">
                        <h1 className="text-3xl font-bold">Experience Management</h1>
                        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center space-x-2">
                            {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                            <span>{showForm ? 'Cancel' : 'Add Experience'}</span>
                        </button>
                    </div>

                    {showForm && (
                        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 mb-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="px-4 py-2 border rounded-lg" required />
                                <input type="text" placeholder="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="px-4 py-2 border rounded-lg" required />
                            </div>
                            <input type="text" placeholder="Period (e.g., 2020 - 2022)" value={formData.period} onChange={(e) => setFormData({ ...formData, period: e.target.value })} className="w-full px-4 py-2 border rounded-lg" required />
                            <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg" rows={2} />
                            <textarea placeholder='Achievements (JSON array, e.g., ["Achievement 1", "Achievement 2"])' value={formData.achievements} onChange={(e) => setFormData({ ...formData, achievements: e.target.value })} className="w-full px-4 py-2 border rounded-lg" rows={3} required />
                            <input type="text" placeholder='Tech Stack (JSON array, e.g., ["Python", "AWS"])' value={formData.techStack} onChange={(e) => setFormData({ ...formData, techStack: e.target.value })} className="w-full px-4 py-2 border rounded-lg" required />
                            <button type="submit" className="btn-primary flex items-center space-x-2">
                                <Save className="w-5 h-5" />
                                <span>{editingId ? 'Update' : 'Create'}</span>
                            </button>
                        </form>
                    )}

                    <div className="space-y-4">
                        {experiences.map((exp) => (
                            <div key={exp.id} className="bg-white rounded-xl shadow-sm border p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-semibold">{exp.role}</h3>
                                        <p className="text-gray-600">{exp.company} • {exp.period}</p>
                                        <ul className="mt-2 space-y-1">
                                            {JSON.parse(exp.achievements || '[]').map((ach: string, idx: number) => (
                                                <li key={idx} className="text-sm text-gray-700">• {ach}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEdit(exp)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDelete(exp.id!)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
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
