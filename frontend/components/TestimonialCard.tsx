import React from 'react';
import Image from 'next/image';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { MotionFade, StaggerContainer, StaggerItem } from './motion/MotionWrapper';

export interface Testimonial {
    id: number;
    name: string;
    role: string;
    company: string;
    content: string;
    avatarUrl?: string;
    linkedinUrl?: string;
}

interface TestimonialCardProps {
    testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
    return (
        <motion.div
            className="card-neon p-6 relative group h-full flex flex-col"
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
            {/* Quote icon */}
            <Quote className="absolute top-4 right-4 w-8 h-8 text-cyan-500/10 group-hover:text-cyan-500/20 transition-colors" />

            {/* Content */}
            <blockquote className="text-gray-300 mb-6 relative z-10 flex-1">
                <p className="italic leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-electric-500 flex items-center justify-center text-white font-bold overflow-hidden ring-2 ring-cyan-500/20">
                    {testimonial.avatarUrl ? (
                        <Image
                            src={testimonial.avatarUrl}
                            alt={testimonial.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-lg">{testimonial.name.charAt(0)}</span>
                    )}
                </div>

                {/* Info */}
                <div>
                    <div className="font-semibold text-white">
                        {testimonial.linkedinUrl ? (
                            <a
                                href={testimonial.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-cyan-400 transition-colors"
                            >
                                {testimonial.name}
                            </a>
                        ) : (
                            testimonial.name
                        )}
                    </div>
                    <div className="text-sm text-gray-400">
                        {testimonial.role} at {testimonial.company}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

/**
 * Testimonials Section Component
 */
export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
    if (!testimonials || testimonials.length === 0) {
        return null;
    }

    return (
        <section id="testimonials" className="py-24 px-4 bg-dark-900 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl" />
            <div className="max-w-6xl mx-auto relative z-10">
                <MotionFade>
                    <h2 className="text-4xl font-bold mb-4 text-center text-white">
                        What People <span className="gradient-text">Say</span>
                    </h2>
                    <p className="text-lg text-center text-gray-400 mb-12 max-w-xl mx-auto">
                        Feedback from colleagues and collaborators
                    </p>
                </MotionFade>

                <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial) => (
                        <StaggerItem key={testimonial.id}>
                            <TestimonialCard testimonial={testimonial} />
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </div>
        </section>
    );
}
