/**
 * Skill Progress Bar Component
 * 
 * Animated progress bar for displaying skill proficiency.
 */

'use client';

import React from 'react';
import { useInView } from './ScrollAnimation';

interface SkillProgressProps {
    name: string;
    level: number; // 0-100
    color?: 'primary' | 'accent' | 'green' | 'blue' | 'purple';
    showPercentage?: boolean;
}

export default function SkillProgress({ 
    name, 
    level, 
    color = 'primary',
    showPercentage = true 
}: SkillProgressProps) {
    const { ref, isInView } = useInView({ threshold: 0.5 });

    const colorClasses = {
        primary: 'from-primary-500 to-primary-600',
        accent: 'from-accent-500 to-accent-600',
        green: 'from-green-500 to-emerald-600',
        blue: 'from-blue-500 to-cyan-600',
        purple: 'from-purple-500 to-indigo-600',
    };

    const bgColorClasses = {
        primary: 'bg-primary-100 dark:bg-primary-900/30',
        accent: 'bg-accent-100 dark:bg-accent-900/30',
        green: 'bg-green-100 dark:bg-green-900/30',
        blue: 'bg-blue-100 dark:bg-blue-900/30',
        purple: 'bg-purple-100 dark:bg-purple-900/30',
    };

    return (
        <div ref={ref as React.RefObject<HTMLDivElement>} className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 dark:text-gray-300">{name}</span>
                {showPercentage && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">{level}%</span>
                )}
            </div>
            
            <div className={`h-3 rounded-full overflow-hidden ${bgColorClasses[color]}`}>
                <div
                    className={`
                        h-full rounded-full bg-gradient-to-r ${colorClasses[color]}
                        transition-all duration-1000 ease-out
                        ${isInView ? '' : 'w-0'}
                    `}
                    style={{ width: isInView ? `${level}%` : '0%' }}
                    role="progressbar"
                    aria-valuenow={level}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${name} proficiency: ${level}%`}
                />
            </div>
        </div>
    );
}

/**
 * Skills with progress bars section
 */
export function SkillsWithProgress({ skills }: { 
    skills: Array<{ name: string; level: number; category: string }> 
}) {
    // Group skills by category
    const skillsByCategory = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill);
        return acc;
    }, {} as Record<string, typeof skills>);

    const categoryColors: Record<string, 'primary' | 'accent' | 'green' | 'blue' | 'purple'> = {
        'Machine Learning': 'primary',
        'LLMs & NLP': 'accent',
        'Data & MLOps': 'blue',
        'Deployment': 'green',
        'Other': 'purple',
    };

    return (
        <div className="grid md:grid-cols-2 gap-8">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <div key={category} className="card p-6">
                    <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                        {category}
                    </h3>
                    <div className="space-y-4">
                        {categorySkills.map((skill) => (
                            <SkillProgress
                                key={skill.name}
                                name={skill.name}
                                level={skill.level}
                                color={categoryColors[category] || 'primary'}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
