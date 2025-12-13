import { Education, Certification } from '@prisma/client';

interface EducationSectionProps {
    education: Education[];
    certifications: Certification[];
}

export default function EducationSection({ education, certifications }: EducationSectionProps) {
    return (
        <section id="education" className="py-20 px-4 bg-white">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold mb-12 text-center">
                    Education & <span className="gradient-text">Certifications</span>
                </h2>

                <div className="space-y-6">
                    {education.map((edu) => (
                        <div key={edu.id} className="card p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-semibold">{edu.degree}</h3>
                                    <p className="text-primary-600 font-medium">{edu.school}</p>
                                    {edu.details && <p className="text-gray-600 mt-2">{edu.details}</p>}
                                </div>
                                <span className="text-gray-500">{edu.period}</span>
                            </div>
                        </div>
                    ))}

                    <div className="card p-6">
                        <h3 className="text-xl font-semibold mb-4">Certifications</h3>
                        <ul className="space-y-2 text-gray-700">
                            {certifications.map((cert) => (
                                <li key={cert.id}>• {cert.name} {cert.issuer && `(${cert.issuer})`}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
