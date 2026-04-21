import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import axios from 'axios';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface Education {
    id?: number;
    degree: string;
    school: string;
    period: string;
    details?: string;
}

export default function EducationManagement() {
    const [education, setEducation] = useState<Education[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<Education>({ degree: '', school: '', period: '', details: '' });

    useEffect(() => {
        fetchEducation();
    }, []);

    const fetchEducation = async () => {
        const response = await axios.get('/api/admin/education');
        setEducation(response.data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            await axios.put('/api/admin/education', { ...formData, id: editingId });
        } else {
            await axios.post('/api/admin/education', formData);
        }
        resetForm();
        fetchEducation();
    };

    const handleDelete = async (id: number) => {
        if (confirm('Delete this education entry?')) {
            await axios.delete('/api/admin/education', { data: { id } });
            fetchEducation();
        }
    };

    const handleEdit = (edu: Education) => {
        setFormData(edu);
        setEditingId(edu.id!);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({ degree: '', school: '', period: '', details: '' });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <ProtectedRoute>
            <AdminLayout>
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 flex justify-between items-center">
                        <h1 className="text-3xl font-bold">Education Management</h1>
                        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center space-x-2">
                            {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                            <span>{showForm ? 'Cancel' : 'Add Education'}</span>
                        </button>
                    </div>

                    {showForm && (
                        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 mb-6 space-y-4">
                            <input type="text" placeholder="Degree" value={formData.degree} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} className="w-full px-4 py-2 border rounded-lg" required />
                            <input type="text" placeholder="School" value={formData.school} onChange={(e) => setFormData({ ...formData, school: e.target.value })} className="w-full px-4 py-2 border rounded-lg" required />
                            <input type="text" placeholder="Period (e.g., 2016 - 2020)" value={formData.period} onChange={(e) => setFormData({ ...formData, period: e.target.value })} className="w-full px-4 py-2 border rounded-lg" required />
                            <textarea placeholder="Details (coursework, etc.)" value={formData.details} onChange={(e) => setFormData({ ...formData, details: e.target.value })} className="w-full px-4 py-2 border rounded-lg" rows={3} />
                            <button type="submit" className="btn-primary flex items-center space-x-2">
                                <Save className="w-5 h-5" />
                                <span>{editingId ? 'Update' : 'Create'}</span>
                            </button>
                        </form>
                    )}

                    <div className="space-y-4">
                        {education.map((edu) => (
                            <div key={edu.id} className="bg-white rounded-xl shadow-sm border p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-semibold">{edu.degree}</h3>
                                        <p className="text-gray-600">{edu.school} • {edu.period}</p>
                                        {edu.details && <p className="mt-2 text-sm text-gray-700">{edu.details}</p>}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEdit(edu)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDelete(edu.id!)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
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
