import { GetServerSideProps } from 'next';
import Head from 'next/head';
import prisma from '../lib/prisma';
import { Profile, SocialLink, Skill, Experience, Project, Education, Certification, Testimonial } from '@prisma/client';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import EducationSection from '@/components/sections/EducationSection';
import ContactSection from '@/components/sections/ContactSection';
import GitHubSection from '@/components/sections/GitHubSection';
import PublicationsSection from '@/components/sections/PublicationsSection';
import type { Publication } from '@/components/sections/PublicationsSection';
import AchievementsSection from '@/components/sections/AchievementsSection';
import type { Achievement } from '@/components/sections/AchievementsSection';
import { TestimonialsSection } from '@/components/TestimonialCard';

export interface HomeProps {
    profile: Profile | null;
    socialLinks: SocialLink[];
    skills: Skill[];
    experiences: Experience[];
    projects: Project[];
    education: Education[];
    certifications: Certification[];
    testimonials: Testimonial[];
    publications: Publication[];
    achievements: Achievement[];
    githubUsername: string | null;
    error?: string;
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
        const testimonials = await prisma.testimonial.findMany({
            where: { featured: true },
            orderBy: { order: 'asc' },
        });

        // Fetch new models (with safe fallback if tables don't exist yet)
        let publications: any[] = [];
        let achievements: any[] = [];
        try {
            publications = await (prisma as any).publication.findMany({ orderBy: { year: 'desc' } });
        } catch {
            // Table may not exist yet
        }
        try {
            achievements = await (prisma as any).achievement.findMany({ orderBy: { year: 'desc' } });
        } catch {
            // Table may not exist yet
        }

        // Extract GitHub username from social links
        const githubLink = socialLinks.find(
            (link) => link.platform.toLowerCase() === 'github' || link.url.includes('github.com')
        );
        const githubUsername = githubLink
            ? githubLink.url.replace(/\/$/, '').split('/').pop() || null
            : null;

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
                testimonials: serialize(testimonials),
                publications: serialize(publications),
                achievements: serialize(achievements),
                githubUsername,
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
                testimonials: [],
                publications: [],
                achievements: [],
                githubUsername: null,
                error: error instanceof Error ? error.message : String(error),
            },
        };
    }
};

export default function Home({
    profile,
    socialLinks,
    skills,
    experiences,
    projects,
    education,
    certifications,
    testimonials,
    publications,
    achievements,
    githubUsername,
    error,
}: HomeProps) {
    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-dark-950">
                <h1 className="text-red-400 text-xl font-bold mb-4">Database Connection Error</h1>
                <pre className="bg-dark-800 text-gray-300 p-4 rounded-xl overflow-auto max-w-2xl border border-dark-700">
                    {error}
                </pre>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-950 text-gray-400">
                Loading (Profile not found)...
            </div>
        );
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
            {githubUsername && <GitHubSection username={githubUsername} />}
            <EducationSection education={education} certifications={certifications} />
            <PublicationsSection publications={publications} />
            <AchievementsSection achievements={achievements} />
            <TestimonialsSection testimonials={testimonials as any} />
            <ContactSection profile={profile} socialLinks={socialLinks} />
        </>
    );
}
