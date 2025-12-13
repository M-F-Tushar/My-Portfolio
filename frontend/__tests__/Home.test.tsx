import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../pages/index'

// Mock the section components to simplify the Home test
jest.mock('@/components/sections/HeroSection', () => function HeroSection() { return <div data-testid="hero-section">Hero</div> })
jest.mock('@/components/sections/AboutSection', () => function AboutSection() { return <div data-testid="about-section">About</div> })
jest.mock('@/components/sections/SkillsSection', () => function SkillsSection() { return <div data-testid="skills-section">Skills</div> })
jest.mock('@/components/sections/ExperienceSection', () => function ExperienceSection() { return <div data-testid="experience-section">Experience</div> })
jest.mock('@/components/sections/ProjectsSection', () => function ProjectsSection() { return <div data-testid="projects-section">Projects</div> })
jest.mock('@/components/sections/EducationSection', () => function EducationSection() { return <div data-testid="education-section">Education</div> })
jest.mock('@/components/sections/ContactSection', () => function ContactSection() { return <div data-testid="contact-section">Contact</div> })

describe('Home Page', () => {
    const mockProps = {
        profile: {
            id: 1,
            name: 'Test User',
            title: 'Test Title',
            bio: 'Test Bio',
            summary: 'Test Summary',
            email: 'test@example.com',
            location: 'Test Location',
            yearsOfExperience: '5+',
            modelsDeployed: '10+',
            avatarUrl: null,
            aboutImage: null,
            resumeUrl: null,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        socialLinks: [],
        skills: [],
        experiences: [],
        projects: [],
        education: [],
        certifications: []
    }

    it('renders all sections when profile data is present', () => {
        render(<Home {...mockProps} />)

        expect(screen.getByTestId('hero-section')).toBeInTheDocument()
        expect(screen.getByTestId('about-section')).toBeInTheDocument()
        expect(screen.getByTestId('skills-section')).toBeInTheDocument()
        expect(screen.getByTestId('experience-section')).toBeInTheDocument()
        expect(screen.getByTestId('projects-section')).toBeInTheDocument()
        expect(screen.getByTestId('education-section')).toBeInTheDocument()
        expect(screen.getByTestId('contact-section')).toBeInTheDocument()
    })

    it('renders loading state when profile is null', () => {
        // @ts-ignore
        render(<Home {...mockProps} profile={null} />)
        expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
})
