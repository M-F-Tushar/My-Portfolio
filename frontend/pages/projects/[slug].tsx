import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { ArrowLeft, Calendar, Tag, ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Project } from '@prisma/client';

interface ProjectProps {
    project: Project;
}

export default function ProjectDetail({ project }: ProjectProps) {
    const router = useRouter();

    if (router.isFallback) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const techStack = JSON.parse(project.techStack) as string[];

    return (
        <>
            <Head>
                <title>{project.title} - AI/ML Portfolio</title>
                <meta name="description" content={project.description} />
            </Head>

            <article className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Back button */}
                    <Link href="/#projects" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Projects
                    </Link>

                    {/* Header */}
                    <header className="bg-white rounded-xl shadow-md p-8 mb-8">
                        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>

                        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <time>{new Date(project.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</time>
                            </div>

                            {project.demoUrl && (
                                <a
                                    href={project.demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Live Demo
                                </a>
                            )}

                            {project.repoUrl && (
                                <a
                                    href={project.repoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    <Github className="w-4 h-4" />
                                    View Code
                                </a>
                            )}
                        </div>

                        {techStack && techStack.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {techStack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                                    >
                                        <Tag className="w-3 h-3" />
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        )}
                    </header>

                    {/* Content */}
                    <div className="bg-white rounded-xl shadow-md p-8">
                        {project.content ? (
                            <MarkdownRenderer content={project.content} />
                        ) : (
                            <div className="text-gray-600">
                                <p className="mb-4">{project.description}</p>
                                <p className="text-sm text-gray-500">
                                    Detailed project documentation coming soon. In the meantime, check out the live demo or source code above!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </article>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const slug = params?.slug as string;

    try {
        const project = await prisma.project.findUnique({
            where: { slug },
        });

        if (!project) {
            return {
                notFound: true,
            };
        }

        // Serialize dates
        const serializedProject = JSON.parse(JSON.stringify(project));

        return {
            props: {
                project: serializedProject,
            },
        };
    } catch (error) {
        console.error('Error fetching project:', error);
        return {
            notFound: true,
        };
    }
};
