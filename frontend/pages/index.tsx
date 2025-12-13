import { GetServerSideProps } from 'next';
import Head from 'next/head';
import prisma from '../lib/prisma';
import { Profile, SocialLink, Skill, Experience, Project, Education, Certification } from '@prisma/client';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import EducationSection from '@/components/sections/EducationSection';
import ContactSection from '@/components/sections/ContactSection';

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
        const profile = {
            id: 1,
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
            createdAt: new Date(), // serialized below
            updatedAt: new Date(),
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

        // Helper to serialize dates
        const serialize = <T extends any>(data: T): T => JSON.parse(JSON.stringify(data));

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
        };
    } catch (error) {
        console.error('Error fetching initial props:', error);
        return {
            props: {
                profile: null,
                socialLinks: [],
                skills: [],
                experiences: [],
                projects: [],
                education: [],
                certifications: [],
                error: error instanceof Error ? error.message : String(error),
            },
        };
    }
};

export default function Home({ profile, socialLinks, skills, experiences, projects, education, certifications, error }: HomeProps) {
    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-red-500 text-xl font-bold mb-4">Database Connection Error</h1>
                <pre className="bg-gray-900 text-white p-4 rounded overflow-auto max-w-2xl">
                    {error}
                </pre>
            </div>
        );
    }

    if (!profile) {
        return <div className="min-h-screen flex items-center justify-center">Loading (Profile not found)...</div>;
    }

    return (
        <>
            <Head>
                <title>{profile.name} - {profile.title}</title>
                <meta name="description" content={profile.bio} />
            </Head>

            <HeroSection profile={profile} socialLinks={socialLinks} />
            <AboutSection profile={profile} />
            <SkillsSection skills={skills} />
            <ExperienceSection experiences={experiences} />
            <ProjectsSection projects={projects} />
            <EducationSection education={education} certifications={certifications} />
            <ContactSection profile={profile} socialLinks={socialLinks} />
        </>
    );
}


