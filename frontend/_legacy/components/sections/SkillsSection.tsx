import { Brain, Zap, Database, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skill } from '@prisma/client';
import { MotionFade, StaggerContainer, StaggerItem } from '../motion/MotionWrapper';

interface SkillsSectionProps {
    skills: Skill[];
}

const categoryConfig: Record<string, { icon: typeof Brain }> = {
    'Machine Learning': { icon: Brain },
    'LLMs & NLP': { icon: Zap },
    'Data & MLOps': { icon: Database },
    'Deployment': { icon: Cpu },
};

export default function SkillsSection({ skills }: SkillsSectionProps) {
    const skillsByCategory = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill.name);
        return acc;
    }, {} as Record<string, string[]>);

    return (
        <section id="skills" className="py-24 px-4 bg-dark-950 bg-grid relative">
            <div className="max-w-6xl mx-auto">
                <MotionFade>
                    <h2 className="text-4xl font-bold mb-12 text-center text-white">
                        Technical <span className="gradient-text">Arsenal</span>
                    </h2>
                </MotionFade>

                <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.entries(skillsByCategory).map(([category, categorySkills]) => {
                        const config = categoryConfig[category] || { icon: Brain };
                        const Icon = config.icon;

                        return (
                            <StaggerItem key={category}>
                                <motion.div
                                    className="card-neon p-6 group h-full"
                                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.2, rotate: 5 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Icon className="w-12 h-12 text-cyan-400 mb-4 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)] group-hover:text-cyan-300 transition-colors" />
                                    </motion.div>
                                    <h3 className="text-xl font-semibold text-white mb-4">{category}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {categorySkills.map(skill => (
                                            <span key={skill} className="tech-tag text-xs cursor-default">
                                                {skill}
                                            </span>
                                        ))}
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
