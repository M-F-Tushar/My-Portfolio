import Link from 'next/link';
import Image from 'next/image';
import { Github, ExternalLink } from 'lucide-react';
import { Project } from '@prisma/client';

interface ProjectsSectionProps {
    projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
    return (
        <section id="projects" className="py-20 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold mb-12 text-center">
                    Featured <span className="gradient-text">Projects</span>
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => {
                        const techStack = JSON.parse(project.techStack) as string[];
                        return (
                            <div key={project.id} className="card group overflow-hidden tilt-card">
                                {project.featured && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className="px-3 py-1 bg-gradient-primary text-white text-xs font-bold rounded-full shadow-lg">
                                            FEATURED
                                        </span>
                                    </div>
                                )}
                                <div className="aspect-video bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-4xl overflow-hidden relative">
                                    {project.imageUrl ? (
                                        <Image src={project.imageUrl} alt={`${project.title} project screenshot`} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                                    ) : (
                                        <span className="group-hover:scale-110 transition-transform duration-500" role="img" aria-label="Project icon">
                                            {project.title.includes("Chatbot") ? '🤖' : project.title.includes("Vision") ? '🔍' : '📊'}
                                        </span>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                        <p className="text-white text-sm line-clamp-2">{project.description}</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <Link href={`/projects/${project.id}`}>
                                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors cursor-pointer">
                                            {project.title}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-600 mb-4 line-clamp-2">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {techStack.map(tech => (
                                            <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-primary-100 hover:text-primary-700 transition-colors">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-3">
                                        <Link href={`/projects/${project.id}`} className="text-primary-600 hover:text-primary-700 flex items-center gap-1 text-sm font-medium">
                                            <ExternalLink className="w-4 h-4" />
                                            Learn More
                                        </Link>
                                        {project.demoUrl && (
                                            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-accent-600 hover:text-accent-700 flex items-center gap-1 text-sm font-medium">
                                                <ExternalLink className="w-4 h-4" />
                                                Live Demo
                                            </a>
                                        )}
                                        {project.repoUrl && (
                                            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-700 flex items-center gap-1 text-sm font-medium">
                                                <Github className="w-4 h-4" />
                                                Code
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
