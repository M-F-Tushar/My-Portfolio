import { motion } from 'framer-motion';
import { Experience } from '@prisma/client';
import { MotionFade, StaggerContainer, fadeInUp, smoothTransition } from '../motion/MotionWrapper';

interface ExperienceSectionProps {
    experiences: Experience[];
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
    return (
        <section id="experience" className="py-24 px-4 bg-dark-900 relative">
            <div className="max-w-4xl mx-auto">
                <MotionFade>
                    <h2 className="text-4xl font-bold mb-12 text-center text-white">
                        Work <span className="gradient-text">Experience</span>
                    </h2>
                </MotionFade>

                <StaggerContainer className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-cyan-500/20 to-transparent" />

                    <div className="space-y-8">
                        {experiences.map((exp, index) => {
                            const achievements = JSON.parse(exp.achievements) as string[];
                            const techStack = JSON.parse(exp.techStack) as string[];

                            return (
                                <motion.div
                                    key={exp.id}
                                    className="relative pl-12 md:pl-20"
                                    variants={fadeInUp}
                                    transition={{ ...smoothTransition, delay: index * 0.1 }}
                                >
                                    {/* Timeline dot */}
                                    <motion.div
                                        className="absolute left-2 md:left-6 top-6 w-4 h-4 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                    />

                                    <div className="card-neon p-6">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                                            <div>
                                                <h3 className="text-xl sm:text-2xl font-semibold text-white">{exp.role}</h3>
                                                <p className="text-cyan-400 font-medium">{exp.company}</p>
                                            </div>
                                            <span className="text-gray-500 text-sm font-mono whitespace-nowrap">{exp.period}</span>
                                        </div>

                                        <ul className="space-y-2 mb-4">
                                            {achievements.map((item, i) => (
                                                <li key={i} className="text-gray-400 flex items-start gap-2">
                                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="flex flex-wrap gap-2">
                                            {techStack.map(tech => (
                                                <span key={tech} className="tech-tag text-xs">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </StaggerContainer>
            </div>
        </section>
    );
}
