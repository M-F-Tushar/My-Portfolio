import Link from 'next/link';
import Image from 'next/image';
import { Github, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Project } from '@prisma/client';
import { MotionFade, StaggerContainer, StaggerItem } from '../motion/MotionWrapper';

interface ProjectsSectionProps {
    projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
    return (
        <section id="projects" className="py-24 px-4 bg-dark-950 bg-dots relative">
            <div className="max-w-6xl mx-auto">
                <MotionFade>
                    <h2 className="text-4xl font-bold mb-12 text-center text-white">
                        Featured <span className="gradient-text">Projects</span>
                    </h2>
                </MotionFade>

                <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => {
                        const techStack = JSON.parse(project.techStack) as string[];
                        return (
                            <StaggerItem key={project.id}>
                                <motion.div
                                    className="card-neon group overflow-hidden h-full flex flex-col"
                                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                >
                                    {/* Image Area */}
                                    <div className="aspect-video bg-dark-800 flex items-center justify-center text-4xl overflow-hidden relative">
                                        {project.featured && (
                                            <div className="absolute top-3 right-3 z-10">
                                                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-bold rounded-full border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                                                    FEATURED
                                                </span>
                                            </div>
                                        )}
                                        {project.imageUrl ? (
                                            <Image
                                                src={project.imageUrl}
                                                alt={`${project.title} project screenshot`}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="text-cyan-400/30 group-hover:text-cyan-400/50 transition-colors text-5xl">
                                                {project.title.includes('Chatbot') ? '>' : project.title.includes('Vision') ? '{}' : '()'}
                                            </div>
                                        )}
                                        {/* Gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/30 to-transparent" />
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <Link href={`/projects/${project.id}`}>
                                            <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-cyan-400 transition-colors cursor-pointer">
                                                {project.title}
                                            </h3>
                                        </Link>
                                        <p className="text-gray-400 mb-4 line-clamp-2 flex-1">
                                            {project.description}
                                        </p>

                                        {/* Tech Stack */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {techStack.slice(0, 4).map(tech => (
                                                <span key={tech} className="tech-tag text-xs">
                                                    {tech}
                                                </span>
                                            ))}
                                            {techStack.length > 4 && (
                                                <span className="text-gray-500 text-xs py-1">
                                                    +{techStack.length - 4}
                                                </span>
                                            )}
                                        </div>

                                        {/* Links */}
                                        <div className="flex gap-4 pt-2 border-t border-dark-600">
                                            <Link
                                                href={`/projects/${project.id}`}
                                                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 text-sm font-medium mt-3 transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                Details
                                            </Link>
                                            {project.demoUrl && (
                                                <a
                                                    href={project.demoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-accent-400 hover:text-accent-300 flex items-center gap-1.5 text-sm font-medium mt-3 transition-colors"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    Demo
                                                </a>
                                            )}
                                            {project.repoUrl && (
                                                <a
                                                    href={project.repoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-400 hover:text-gray-300 flex items-center gap-1.5 text-sm font-medium mt-3 transition-colors"
                                                >
                                                    <Github className="w-4 h-4" />
                                                    Code
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </StaggerItem>
                        );
                    })}
                </StaggerContainer>
            </div>
        </section>
    );
}
