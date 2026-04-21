import { FileText, ExternalLink, Calendar, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { MotionFade, StaggerContainer, StaggerItem } from '../motion/MotionWrapper';

export interface Publication {
    id: number;
    title: string;
    authors: string;
    venue: string;
    year: number;
    abstract?: string | null;
    url?: string | null;
    doi?: string | null;
    type: string; // 'conference' | 'journal' | 'preprint' | 'thesis'
}

interface PublicationsSectionProps {
    publications: Publication[];
}

const typeConfig: Record<string, { label: string; color: string }> = {
    conference: { label: 'Conference', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    journal: { label: 'Journal', color: 'text-electric-400 bg-electric-400/10 border-electric-400/30' },
    preprint: { label: 'Preprint', color: 'text-violet-400 bg-violet-400/10 border-violet-400/30' },
    thesis: { label: 'Thesis', color: 'text-amber-400 bg-amber-400/10 border-amber-400/30' },
};

export default function PublicationsSection({ publications }: PublicationsSectionProps) {
    // If no publications, show "coming soon" placeholder
    if (!publications || publications.length === 0) {
        return (
            <section id="publications" className="py-24 px-4 bg-dark-900 bg-grid relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-500/5 rounded-full blur-3xl" />
                <div className="max-w-4xl mx-auto relative z-10">
                    <MotionFade>
                        <h2 className="text-4xl font-bold mb-4 text-center text-white">
                            Research & <span className="gradient-text">Publications</span>
                        </h2>
                        <p className="text-lg text-center text-gray-400 mb-12 max-w-xl mx-auto">
                            Exploring the frontiers of AI and machine learning
                        </p>
                    </MotionFade>

                    <MotionFade>
                        <div className="card-neon p-12 text-center">
                            <motion.div
                                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center"
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <BookOpen className="w-10 h-10 text-cyan-400" />
                            </motion.div>
                            <h3 className="text-2xl font-semibold text-white mb-3">Research in Progress</h3>
                            <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
                                Currently working on research in AI/ML. Publications and preprints will appear here as they become available.
                            </p>
                            <div className="mt-8 flex justify-center gap-3">
                                <span className="tech-tag">Machine Learning</span>
                                <span className="tech-tag">Deep Learning</span>
                                <span className="tech-tag">NLP</span>
                            </div>
                        </div>
                    </MotionFade>
                </div>
            </section>
        );
    }

    return (
        <section id="publications" className="py-24 px-4 bg-dark-900 bg-grid relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-500/5 rounded-full blur-3xl" />
            <div className="max-w-4xl mx-auto relative z-10">
                <MotionFade>
                    <h2 className="text-4xl font-bold mb-4 text-center text-white">
                        Research & <span className="gradient-text">Publications</span>
                    </h2>
                    <p className="text-lg text-center text-gray-400 mb-12 max-w-xl mx-auto">
                        Exploring the frontiers of AI and machine learning
                    </p>
                </MotionFade>

                <StaggerContainer className="space-y-4">
                    {publications.map((pub) => {
                        const config = typeConfig[pub.type] || typeConfig.preprint;
                        return (
                            <StaggerItem key={pub.id}>
                                <div className="card-neon p-6">
                                    <div className="flex flex-wrap items-start gap-3 mb-3">
                                        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${config.color}`}>
                                            {config.label}
                                        </span>
                                        <span className="flex items-center gap-1 text-gray-500 text-sm">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {pub.year}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-semibold text-white mb-2 leading-snug">
                                        {pub.url ? (
                                            <a
                                                href={pub.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-cyan-400 transition-colors"
                                            >
                                                {pub.title}
                                            </a>
                                        ) : (
                                            pub.title
                                        )}
                                    </h3>

                                    <p className="text-sm text-gray-400 mb-1">{pub.authors}</p>
                                    <p className="text-sm text-cyan-400/70 italic">{pub.venue}</p>

                                    {pub.abstract && (
                                        <p className="text-sm text-gray-500 mt-3 line-clamp-2">{pub.abstract}</p>
                                    )}

                                    {(pub.url || pub.doi) && (
                                        <div className="flex gap-4 mt-4">
                                            {pub.url && (
                                                <a
                                                    href={pub.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 text-sm font-medium transition-colors"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    Paper
                                                </a>
                                            )}
                                            {pub.doi && (
                                                <a
                                                    href={`https://doi.org/${pub.doi}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-400 hover:text-gray-300 flex items-center gap-1.5 text-sm font-medium transition-colors"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    DOI
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </StaggerItem>
                        );
                    })}
                </StaggerContainer>
            </div>
        </section>
    );
}
