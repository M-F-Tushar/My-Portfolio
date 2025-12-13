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
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async ({ res }) => {
    // Cache the response for 60 seconds at the edge, and revalidate in the background
    res.setHeader(
        'Cache-Control',
        'public, s-maxage=60, stale-while-revalidate=59'
    );

    try {
        const profile = await prisma.profile.findFirst();
        const socialLinks = await prisma.socialLink.findMany();
        const skills = await prisma.skill.findMany();
        const experiences = await prisma.experience.findMany({ orderBy: { id: 'desc' } });
        const projects = await prisma.project.findMany({ orderBy: { featured: 'desc' } });
        const education = await prisma.education.findMany({ orderBy: { id: 'desc' } });
        const certifications = await prisma.certification.findMany();

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
            },
        };
    }
};

export default function Home({ profile, socialLinks, skills, experiences, projects, education, certifications }: HomeProps) {
    if (!profile) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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


