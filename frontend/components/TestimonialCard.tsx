/**
 * Testimonial Card Component
 */

import React from 'react';
import Image from 'next/image';
import { Quote } from 'lucide-react';

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
        <div className="card p-6 relative group">
            {/* Quote icon */}
            <Quote className="absolute top-4 right-4 w-8 h-8 text-primary-100 dark:text-primary-800 group-hover:text-primary-200 transition-colors" />
            
            {/* Content */}
            <blockquote className="text-gray-700 dark:text-gray-300 mb-6 relative z-10">
                <p className="italic leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
            </blockquote>
            
            {/* Author */}
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold overflow-hidden">
                    {testimonial.avatarUrl ? (
                        <Image
                            src={testimonial.avatarUrl}
                            alt={testimonial.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span>{testimonial.name.charAt(0)}</span>
                    )}
                </div>
                
                {/* Info */}
                <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.linkedinUrl ? (
                            <a 
                                href={testimonial.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary-600 transition-colors"
                            >
                                {testimonial.name}
                            </a>
                        ) : (
                            testimonial.name
                        )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role} at {testimonial.company}
                    </div>
                </div>
            </div>
        </div>
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
        <section id="testimonials" className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold mb-12 text-center">
                    What People <span className="gradient-text">Say</span>
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial) => (
                        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                    ))}
                </div>
            </div>
        </section>
    );
}
