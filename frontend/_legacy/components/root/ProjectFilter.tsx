/**
 * Project Filter Component
 * 
 * Filter and search projects by technology stack.
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Project } from '@prisma/client';

interface ProjectFilterProps {
    projects: Project[];
    onFilteredProjects: (projects: Project[]) => void;
}

export default function ProjectFilter({ projects, onFilteredProjects }: ProjectFilterProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTech, setSelectedTech] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    // Extract all unique technologies from projects
    const allTechnologies = useMemo(() => {
        const techSet = new Set<string>();
        projects.forEach(project => {
            try {
                const techs = JSON.parse(project.techStack) as string[];
                techs.forEach(tech => techSet.add(tech));
            } catch {
                // Handle non-JSON tech stack
                project.techStack.split(',').forEach(tech => techSet.add(tech.trim()));
            }
        });
        return Array.from(techSet).sort();
    }, [projects]);

    // Filter projects based on search and selected technologies
    const filteredProjects = useMemo(() => {
        let result = projects;

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(project =>
                project.title.toLowerCase().includes(query) ||
                project.description.toLowerCase().includes(query)
            );
        }

        // Filter by selected technologies
        if (selectedTech.length > 0) {
            result = result.filter(project => {
                try {
                    const projectTechs = JSON.parse(project.techStack) as string[];
                    return selectedTech.some(tech => projectTechs.includes(tech));
                } catch {
                    const projectTechs = project.techStack.split(',').map(t => t.trim());
                    return selectedTech.some(tech => projectTechs.includes(tech));
                }
            });
        }

        return result;
    }, [projects, searchQuery, selectedTech]);

    // Update parent with filtered projects
    React.useEffect(() => {
        onFilteredProjects(filteredProjects);
    }, [filteredProjects, onFilteredProjects]);

    const toggleTech = (tech: string) => {
        setSelectedTech(prev =>
            prev.includes(tech)
                ? prev.filter(t => t !== tech)
                : [...prev, tech]
        );
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedTech([]);
    };

    const hasActiveFilters = searchQuery || selectedTech.length > 0;

    return (
        <div className="mb-8 space-y-4">
            {/* Search and Filter Toggle */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                   focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Filter Toggle Button */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors
                        ${showFilters || selectedTech.length > 0
                            ? 'bg-primary-50 border-primary-300 text-primary-700 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-300'
                            : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
                        }
                    `}
                >
                    <Filter className="w-5 h-5" />
                    Filter
                    {selectedTech.length > 0 && (
                        <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {selectedTech.length}
                        </span>
                    )}
                </button>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                        <X className="w-4 h-4" />
                        Clear
                    </button>
                )}
            </div>

            {/* Technology Filter Tags */}
            {showFilters && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Filter by technology:</p>
                    <div className="flex flex-wrap gap-2">
                        {allTechnologies.map(tech => (
                            <button
                                key={tech}
                                onClick={() => toggleTech(tech)}
                                className={`
                                    px-3 py-1 rounded-full text-sm transition-all
                                    ${selectedTech.includes(tech)
                                        ? 'bg-primary-500 text-white shadow-md'
                                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-primary-400'
                                    }
                                `}
                            >
                                {tech}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Results Count */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredProjects.length} of {projects.length} projects
                {hasActiveFilters && ' (filtered)'}
            </div>
        </div>
    );
}
