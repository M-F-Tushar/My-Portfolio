import { GetServerSideProps } from 'next';
import Head from 'next/head';
// import prisma from '../lib/prisma'; // DISABLED FOR DEBUGGING
// import { Profile, SocialLink, Skill, Experience, Project, Education, Certification } from '@prisma/client'; // DISABLED

import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import EducationSection from '@/components/sections/EducationSection';
import ContactSection from '@/components/sections/ContactSection';

// --- LOCAL MOCK INTERFACES (To replace Prisma types temporarily) ---
interface Profile {
    name: string;
    title: string;
    bio: string;
    summary: string;
    email: string;
    location: string;
    resumeUrl: string | null;
    avatarUrl: string | null;
    aboutImage: string | null;
    yearsOfExperience: string;
    modelsDeployed: string;
}

interface SocialLink {
    platform: string;
    url: string;
    icon: string;
}

interface Skill {
    id: number;
    name: string;
    category: string;
}

interface Experience {
    id: number;
    company: string;
    role: string;
    period: string;
    description: string | null;
    achievements: string;
    techStack: string;
}

interface Project {
    id: number;
    title: string;
    slug: string;
    description: string;
    content: string;
    imageUrl: string | null;
    demoUrl: string | null;
    repoUrl: string | null;
    techStack: string;
    featured: boolean;
}

interface Education {
    id: number;
    degree: string;
    school: string;
    period: string;
    details: string | null;
}

interface Certification {
    id: number;
    name: string;
    issuer: string | null;
    date: string | null;
    url: string | null;
}
// ----------------------------------------------------

export interface HomeProps {
    profile: Profile | null;
    socialLinks: SocialLink[];
    skills: Skill[];
    experiences: Experience[];
    projects: Project[];
    education: Education[];
    certifications: Certification[];
    error?: string;
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async ({ res }) => {
    res.setHeader(
        'Cache-Control',
        'public, s-maxage=60, stale-while-revalidate=59'
    );

    try {
        // MOCK DATA MODE - To verify if DB connection is the cause of 500s
        const profile: Profile = {
            name: "M-F-Tushar",
            title: "AI Engineer (Mock)",
            bio: "Mock Bio for Debugging",
            summary: "Mock Summary",
            email: "test@example.com",
            location: "Earth",
            resumeUrl: "",
            avatarUrl: "",
            aboutImage: "",
            yearsOfExperience: "5",
            modelsDeployed: "10",
        };
        const socialLinks: SocialLink[] = [];
        const skills: Skill[] = [];
        const experiences: Experience[] = [];
        const projects: Project[] = [];
        const education: Education[] = [];
        const certifications: Certification[] = [];

        /*
        const profile = await prisma.profile.findFirst();
        const socialLinks = await prisma.socialLink.findMany();
        const skills = await prisma.skill.findMany();
        const experiences = await prisma.experience.findMany({ orderBy: { id: 'desc' } });
        const projects = await prisma.project.findMany({ orderBy: { featured: 'desc' } });
        const education = await prisma.education.findMany({ orderBy: { id: 'desc' } });
        const certifications = await prisma.certification.findMany();
        */

        // No serialization needed for mock data without Date objects
        return {
            props: {
                profile: profile,
                socialLinks: socialLinks,
                skills: skills,
                experiences: experiences,
                projects: projects,
                education: education,
                certifications: certifications,
            },
        };
    } catch (error) {
        console.error('Error fetching initial props:', error);
        return {
            props: {
                // @ts-ignore
                profile: null, socialLinks: [], skills: [], experiences: [], projects: [], education: [], certifications: [],
                error: error instanceof Error ? error.message : String(error),
            },
        };
    }
};

export default function Home({ profile, socialLinks, skills, experiences, projects, education, certifications, error }: HomeProps) {
    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-red-500 text-xl font-bold mb-4">Debugging Error</h1>
                <pre className="bg-gray-900 text-white p-4 rounded overflow-auto max-w-2xl">
                    {error}
                </pre>
            </div>
        );
    }

    if (!profile) {
        return <div className="min-h-screen flex items-center justify-center">Loading (Profile not found)...</div>;
    }

    // @ts-ignore - Ignoring strict type checks for debug mode
    return (
        <>
            <Head>
                <title>{profile.name} - {profile.title}</title>
                <meta name="description" content={profile.bio} />
            </Head>

            <HeroSection profile={profile as any} socialLinks={socialLinks as any} />
            <AboutSection profile={profile as any} />
            <SkillsSection skills={skills as any} />
            <ExperienceSection experiences={experiences as any} />
            <ProjectsSection projects={projects as any} />
            <EducationSection education={education as any} certifications={certifications as any} />
            <ContactSection profile={profile as any} socialLinks={socialLinks as any} />
        </>
    );
}
