import { Brain, Zap, Database, Cpu } from 'lucide-react';
import { Skill } from '@prisma/client';

interface SkillsSectionProps {
    skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
    const skillsByCategory = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill.name);
        return acc;
    }, {} as Record<string, string[]>);

    return (
        <section id="skills" className="py-20 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold mb-12 text-center">
                    AI/ML <span className="gradient-text">Expertise</span>
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Machine Learning */}
                    <div className="card p-6 gradient-border group">
                        <Brain className="w-12 h-12 text-primary-600 mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-semibold mb-4">Machine Learning</h3>
                        <div className="flex flex-wrap gap-2">
                            {skillsByCategory['Machine Learning']?.map(skill => (
                                <span key={skill} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm hover:bg-primary-200 transition-colors cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* LLMs & NLP */}
                    <div className="card p-6 gradient-border group">
                        <Zap className="w-12 h-12 text-accent-600 mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-semibold mb-4">LLMs & NLP</h3>
                        <div className="flex flex-wrap gap-2">
                            {skillsByCategory['LLMs & NLP']?.map(skill => (
                                <span key={skill} className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm hover:bg-accent-200 transition-colors cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Data & MLOps */}
                    <div className="card p-6 gradient-border group">
                        <Database className="w-12 h-12 text-primary-600 mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-semibold mb-4">Data & MLOps</h3>
                        <div className="flex flex-wrap gap-2">
                            {skillsByCategory['Data & MLOps']?.map(skill => (
                                <span key={skill} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm hover:bg-primary-200 transition-colors cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Deployment */}
                    <div className="card p-6 gradient-border group">
                        <Cpu className="w-12 h-12 text-accent-600 mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-semibold mb-4">Deployment</h3>
                        <div className="flex flex-wrap gap-2">
                            {skillsByCategory['Deployment']?.map(skill => (
                                <span key={skill} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
