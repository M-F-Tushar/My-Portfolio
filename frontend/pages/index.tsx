import { useState } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Github, Linkedin, Mail, Download, ExternalLink, MapPin, Brain, Cpu, Database, Zap } from 'lucide-react';
import prisma from '../lib/prisma';
import { Profile, SocialLink, Skill, Experience, Project, Education, Certification } from '@prisma/client';

interface HomeProps {
    profile: Profile | null;
    socialLinks: SocialLink[];
    skills: Skill[];
    experiences: Experience[];
    projects: Project[];
    education: Education[];
    certifications: Certification[];
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
    const profile = await prisma.profile.findFirst();
    const socialLinks = await prisma.socialLink.findMany();
    const skills = await prisma.skill.findMany();
    const experiences = await prisma.experience.findMany({ orderBy: { id: 'desc' } });
    const projects = await prisma.project.findMany({ orderBy: { featured: 'desc' } });
    const education = await prisma.education.findMany({ orderBy: { id: 'desc' } });
    const certifications = await prisma.certification.findMany();

    const serialize = <T,>(data: T): T => JSON.parse(JSON.stringify(data));

    return {
        props: {
            profile: serialize(profile),
            socialLinks: serialize(socialLinks),
            skills: serialize(skills),
            experiences: serialize(experiences),
            projects: serialize(projects),
            education: serialize(education),
            certifications: serialize(certifications),
        },
        revalidate: 60,
    };
};

export default function Home({ profile, socialLinks, skills, experiences, projects, education, certifications }: HomeProps) {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [formMessage, setFormMessage] = useState('');

    const skillsByCategory = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill.name);
        return acc;
    }, {} as Record<string, string[]>);

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Github': return <Github className="w-6 h-6" />;
            case 'Linkedin': return <Linkedin className="w-6 h-6" />;
            case 'Mail': return <Mail className="w-6 h-6" />;
            default: return <ExternalLink className="w-6 h-6" />;
        }
    };

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('submitting');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setFormStatus('success');
                setFormMessage(data.message);
                setFormData({ name: '', email: '', message: '' });
            } else {
                setFormStatus('error');
                setFormMessage(data.error || 'Something went wrong');
            }
        } catch (error) {
            setFormStatus('error');
            setFormMessage('Failed to send message. Please try again.');
        }

        setTimeout(() => {
            setFormStatus('idle');
            setFormMessage('');
        }, 5000);
    };

    if (!profile) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <>
            <Head>
                <title>{profile.name} - {profile.title}</title>
                <meta name="description" content={profile.bio} />
            </Head>

            {/* Hero Section */}
            <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white px-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="mb-8 animate-fadeIn">
                        <div className="w-32 h-32 mx-auto bg-white/20 rounded-full flex items-center justify-center text-6xl overflow-hidden ring-4 ring-white/30 animate-scale-pulse">
                            {profile.avatarUrl ? (
                                <Image src={profile.avatarUrl} alt={`${profile.name} - AI/ML Engineer`} width={128} height={128} className="w-full h-full object-cover" priority />
                            ) : (
                                <span role="img" aria-label="Profile avatar">👤</span>
                            )}
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fadeIn stagger-1">
                        Hi, I&apos;m <span className="gradient-shimmer">{profile.name}</span>
                    </h1>

                    <p className="text-2xl md:text-3xl mb-4 animate-fadeIn stagger-2">
                        <span className="gradient-shimmer">{profile.title}</span>
                    </p>

                    <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto animate-fadeIn stagger-3">
                        {profile.bio}
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 animate-fadeIn stagger-4">
                        <a href="#projects" className="btn-primary bg-white text-primary-700 hover:bg-primary-50 hover:scale-105">
                            View My Work
                        </a>
                        <a href="#contact" className="btn-secondary bg-primary-800 text-white hover:bg-primary-900 hover:scale-105">
                            Get In Touch
                        </a>
                        {profile.resumeUrl && (
                            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary bg-accent-600 text-white hover:bg-accent-700 flex items-center gap-2 hover:scale-105">
                                <Download className="w-5 h-5" />
                                Download Resume
                            </a>
                        )}
                    </div>

                    {socialLinks.length > 0 && (
                        <div className="flex justify-center gap-4 mt-8 animate-fadeIn stagger-4">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                                    aria-label={link.platform}
                                >
                                    {getIcon(link.icon)}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold mb-8 text-center">
                        About <span className="gradient-text">Me</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="aspect-square bg-gray-200 rounded-xl flex items-center justify-center text-8xl overflow-hidden relative">
                                {profile.aboutImage ? (
                                    <Image src={profile.aboutImage} alt={`About ${profile.name}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                                ) : (
                                    <span role="img" aria-label="About section image">👤</span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="text-lg text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                {profile.summary}
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="card p-4 text-center">
                                    <div className="text-3xl font-bold text-primary-600">{profile.yearsOfExperience}</div>
                                    <div className="text-gray-600">Years Experience</div>
                                </div>
                                <div className="card p-4 text-center">
                                    <div className="text-3xl font-bold text-primary-600">{profile.modelsDeployed}</div>
                                    <div className="text-gray-600">ML Models Deployed</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Skills Section */}
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

            {/* Experience Section */}
            <section id="experience" className="py-20 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold mb-12 text-center">
                        Work <span className="gradient-text">Experience</span>
                    </h2>

                    <div className="space-y-8">
                        {experiences.map((exp) => {
                            const achievements = JSON.parse(exp.achievements) as string[];
                            const techStack = JSON.parse(exp.techStack) as string[];
                            return (
                                <div key={exp.id} className="card p-6 hover:shadow-xl transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-semibold">{exp.role}</h3>
                                            <p className="text-primary-600 font-medium">{exp.company}</p>
                                        </div>
                                        <span className="text-gray-500">{exp.period}</span>
                                    </div>
                                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                                        {achievements.map((item, i) => (
                                            <li key={i}>• {item}</li>
                                        ))}
                                    </ul>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {techStack.map(tech => (
                                            <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Projects Section */}
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

            {/* Education Section */}
            <section id="education" className="py-20 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold mb-12 text-center">
                        Education & <span className="gradient-text">Certifications</span>
                    </h2>

                    <div className="space-y-6">
                        {education.map((edu) => (
                            <div key={edu.id} className="card p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-semibold">{edu.degree}</h3>
                                        <p className="text-primary-600 font-medium">{edu.school}</p>
                                        {edu.details && <p className="text-gray-600 mt-2">{edu.details}</p>}
                                    </div>
                                    <span className="text-gray-500">{edu.period}</span>
                                </div>
                            </div>
                        ))}

                        <div className="card p-6">
                            <h3 className="text-xl font-semibold mb-4">Certifications</h3>
                            <ul className="space-y-2 text-gray-700">
                                {certifications.map((cert) => (
                                    <li key={cert.id}>• {cert.name} {cert.issuer && `(${cert.issuer})`}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20 px-4 bg-gradient-to-br from-primary-600 to-accent-600 text-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold mb-8 text-center">
                        Get In <span className="text-accent-200">Touch</span>
                    </h2>

                    <p className="text-xl text-center text-primary-100 mb-12">
                        I&apos;m always open to new opportunities and interesting ML projects. Let&apos;s connect!
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Mail className="w-6 h-6" />
                                <div>
                                    <div className="font-semibold">Email</div>
                                    <a href={`mailto:${profile.email}`} className="text-primary-100 hover:text-white">
                                        {profile.email}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <MapPin className="w-6 h-6" />
                                <div>
                                    <div className="font-semibold">Location</div>
                                    <div className="text-primary-100">{profile.location}</div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                {socialLinks.map((link) => (
                                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                                        className="p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                                        {getIcon(link.icon)}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="card bg-white text-gray-900 p-6">
                            <form onSubmit={handleContactSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="contact-name" className="block text-sm font-medium mb-2">Name</label>
                                    <input
                                        id="contact-name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        disabled={formStatus === 'submitting'}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="contact-email" className="block text-sm font-medium mb-2">Email</label>
                                    <input
                                        id="contact-email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        disabled={formStatus === 'submitting'}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="contact-message" className="block text-sm font-medium mb-2">Message</label>
                                    <textarea
                                        id="contact-message"
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                        disabled={formStatus === 'submitting'}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                                    ></textarea>
                                </div>
                                {formMessage && (
                                    <div className={`p-3 rounded-lg text-sm ${formStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {formMessage}
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={formStatus === 'submitting'}
                                    className="w-full btn-primary bg-primary-600 text-white hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
