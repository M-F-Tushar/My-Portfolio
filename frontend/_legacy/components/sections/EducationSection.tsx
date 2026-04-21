import { CheckCircle, GraduationCap } from 'lucide-react';
import { Education, Certification } from '@prisma/client';
import { MotionFade, StaggerContainer, StaggerItem } from '../motion/MotionWrapper';

interface EducationSectionProps {
    education: Education[];
    certifications: Certification[];
}

export default function EducationSection({ education, certifications }: EducationSectionProps) {
    return (
        <section id="education" className="py-24 px-4 bg-dark-900 bg-grid relative">
            <div className="max-w-4xl mx-auto">
                <MotionFade>
                    <h2 className="text-4xl font-bold mb-12 text-center text-white">
                        Education & <span className="gradient-text">Certifications</span>
                    </h2>
                </MotionFade>

                <StaggerContainer className="space-y-6">
                    {education.map((edu) => (
                        <StaggerItem key={edu.id}>
                            <div className="card-neon p-6 border-l-4 border-l-cyan-500/30">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                    <div className="flex items-start gap-3">
                                        <GraduationCap className="w-6 h-6 text-cyan-400 mt-1 flex-shrink-0" />
                                        <div>
                                            <h3 className="text-xl sm:text-2xl font-semibold text-white">{edu.degree}</h3>
                                            <p className="text-cyan-400 font-medium">{edu.school}</p>
                                            {edu.details && (
                                                <p className="text-gray-400 mt-2">{edu.details}</p>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-gray-500 text-sm font-mono whitespace-nowrap sm:ml-4">
                                        {edu.period}
                                    </span>
                                </div>
                            </div>
                        </StaggerItem>
                    ))}

                    {certifications.length > 0 && (
                        <StaggerItem>
                            <div className="card-neon p-6">
                                <h3 className="text-xl font-semibold text-white mb-4">Certifications</h3>
                                <ul className="space-y-3">
                                    {certifications.map((cert) => (
                                        <li key={cert.id} className="flex items-start gap-3 text-gray-300">
                                            <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                                            <span>
                                                {cert.name}
                                                {cert.issuer && (
                                                    <span className="text-gray-500"> ({cert.issuer})</span>
                                                )}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </StaggerItem>
                    )}
                </StaggerContainer>
            </div>
        </section>
    );
}
