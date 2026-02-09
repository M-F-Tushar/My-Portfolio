import { Trophy, Award, Medal, Calendar, ExternalLink, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { MotionFade, StaggerContainer, StaggerItem } from '../motion/MotionWrapper';

export interface Achievement {
    id: number;
    title: string;
    organization: string;
    year: number;
    description?: string | null;
    url?: string | null;
    type: string; // 'award' | 'competition' | 'scholarship' | 'recognition'
}

interface AchievementsSectionProps {
    achievements: Achievement[];
}

const typeConfig: Record<string, { icon: typeof Trophy; color: string; label: string }> = {
    award: { icon: Trophy, color: 'text-amber-400 bg-amber-400/10 border-amber-400/30', label: 'Award' },
    competition: { icon: Medal, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', label: 'Competition' },
    scholarship: { icon: Award, color: 'text-electric-400 bg-electric-400/10 border-electric-400/30', label: 'Scholarship' },
    recognition: { icon: Sparkles, color: 'text-violet-400 bg-violet-400/10 border-violet-400/30', label: 'Recognition' },
};

export default function AchievementsSection({ achievements }: AchievementsSectionProps) {
    // If no achievements, show "coming soon" placeholder
    if (!achievements || achievements.length === 0) {
        return (
            <section id="achievements" className="py-24 px-4 bg-dark-950 relative overflow-hidden">
                <div className="absolute top-0 left-1/3 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
                <div className="max-w-4xl mx-auto relative z-10">
                    <MotionFade>
                        <h2 className="text-4xl font-bold mb-4 text-center text-white">
                            Awards & <span className="gradient-text">Achievements</span>
                        </h2>
                        <p className="text-lg text-center text-gray-400 mb-12 max-w-xl mx-auto">
                            Milestones and recognition along the journey
                        </p>
                    </MotionFade>

                    <MotionFade>
                        <div className="card-neon p-12 text-center">
                            <motion.div
                                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center"
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <Trophy className="w-10 h-10 text-amber-400" />
                            </motion.div>
                            <h3 className="text-2xl font-semibold text-white mb-3">Building the Journey</h3>
                            <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
                                Actively pursuing competitions, hackathons, and research opportunities. Awards and achievements will be showcased here.
                            </p>
                            <div className="mt-8 flex justify-center gap-3">
                                <span className="tech-tag">Hackathons</span>
                                <span className="tech-tag">Competitions</span>
                                <span className="tech-tag">Research</span>
                            </div>
                        </div>
                    </MotionFade>
                </div>
            </section>
        );
    }

    return (
        <section id="achievements" className="py-24 px-4 bg-dark-950 relative overflow-hidden">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
            <div className="max-w-4xl mx-auto relative z-10">
                <MotionFade>
                    <h2 className="text-4xl font-bold mb-4 text-center text-white">
                        Awards & <span className="gradient-text">Achievements</span>
                    </h2>
                    <p className="text-lg text-center text-gray-400 mb-12 max-w-xl mx-auto">
                        Milestones and recognition along the journey
                    </p>
                </MotionFade>

                <StaggerContainer className="grid md:grid-cols-2 gap-4">
                    {achievements.map((achievement) => {
                        const config = typeConfig[achievement.type] || typeConfig.recognition;
                        const IconComp = config.icon;
                        return (
                            <StaggerItem key={achievement.id}>
                                <motion.div
                                    className="card-neon p-6 h-full"
                                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center border ${config.color}`}>
                                            <IconComp className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${config.color}`}>
                                                    {config.label}
                                                </span>
                                                <span className="flex items-center gap-1 text-gray-500 text-xs">
                                                    <Calendar className="w-3 h-3" />
                                                    {achievement.year}
                                                </span>
                                            </div>

                                            <h3 className="text-base font-semibold text-white mb-1">
                                                {achievement.title}
                                            </h3>
                                            <p className="text-sm text-cyan-400/70">{achievement.organization}</p>

                                            {achievement.description && (
                                                <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                                                    {achievement.description}
                                                </p>
                                            )}

                                            {achievement.url && (
                                                <a
                                                    href={achievement.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 text-sm font-medium mt-3 transition-colors"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                    View Details
                                                </a>
                                            )}
                                        </div>
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
