import Link from 'next/link';
import { Calendar, Tag, ArrowRight } from 'lucide-react';

interface Project {
    slug: string;
    title: string;
    date: string;
    tags: string[];
    summary: string;
    demoLink?: string;
}

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <div className="card group">
            {/* Card content */}
            <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-600 transition-colors">
                    {project.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                    {project.summary}
                </p>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                            >
                                <Tag className="w-3 h-3" />
                                {tag}
                            </span>
                        ))}
                        {project.tags.length > 3 && (
                            <span className="px-2 py-1 text-gray-500 text-xs">
                                +{project.tags.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4" />
                    <time>{new Date(project.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short'
                    })}</time>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Link
                        href={`/projects/${project.slug}`}
                        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                    </Link>

                    {project.demoLink && (
                        <a
                            href={project.demoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent-600 hover:text-accent-700 font-medium text-sm"
                        >
                            Live Demo
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
