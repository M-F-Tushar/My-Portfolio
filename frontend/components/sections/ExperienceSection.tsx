import { Experience } from '@prisma/client';

interface ExperienceSectionProps {
    experiences: Experience[];
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
    return (
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
    );
}
