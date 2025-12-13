import Image from 'next/image';
import { Profile } from '@prisma/client';

interface AboutSectionProps {
    profile: Profile;
}

export default function AboutSection({ profile }: AboutSectionProps) {
    return (
        <section id="about" className="py-20 px-4 bg-white">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold mb-8 text-center">
                    About <span className="gradient-text">Me</span>
                </h2>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="aspect-square bg-gray-200 rounded-xl flex items-center justify-center text-8xl overflow-hidden relative">
                            {profile.aboutImage ? (
                                <Image src={profile.aboutImage} alt={`About ${profile.name}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                            ) : (
                                <span role="img" aria-label="About section image">👤</span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="text-lg text-gray-700 dark:text-gray-300 whitespace-pre-line">
                            {profile.summary}
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="card p-4 text-center">
                                <div className="text-3xl font-bold text-primary-600">{profile.yearsOfExperience}</div>
                                <div className="text-gray-600">Years Experience</div>
                            </div>
                            <div className="card p-4 text-center">
                                <div className="text-3xl font-bold text-primary-600">{profile.modelsDeployed}</div>
                                <div className="text-gray-600">ML Models Deployed</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
