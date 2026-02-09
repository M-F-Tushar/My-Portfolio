import { useState } from 'react';
import { Mail, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Profile, SocialLink } from '@prisma/client';
import SocialIcon from '../SocialIcon';
import { MotionFade } from '../motion/MotionWrapper';

interface ContactSectionProps {
    profile: Profile;
    socialLinks: SocialLink[];
}

export default function ContactSection({ profile, socialLinks }: ContactSectionProps) {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [formMessage, setFormMessage] = useState('');

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('submitting');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setFormStatus('success');
                setFormMessage(data.message);
                setFormData({ name: '', email: '', message: '' });
            } else {
                setFormStatus('error');
                setFormMessage(data.error || 'Something went wrong');
            }
        } catch {
            setFormStatus('error');
            setFormMessage('Failed to send message. Please try again.');
        }

        setTimeout(() => {
            setFormStatus('idle');
            setFormMessage('');
        }, 5000);
    };

    return (
        <section id="contact" className="py-24 px-4 bg-dark-950 relative overflow-hidden">
            {/* Center glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

            <div className="max-w-4xl mx-auto relative z-10">
                <MotionFade>
                    <h2 className="text-4xl font-bold mb-4 text-center text-white">
                        Get In <span className="gradient-text">Touch</span>
                    </h2>
                    <p className="text-lg text-center text-gray-400 mb-12 max-w-xl mx-auto">
                        I&apos;m always open to new opportunities and interesting ML projects. Let&apos;s connect!
                    </p>
                </MotionFade>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <MotionFade direction="left">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div>
                                    <div className="font-semibold text-white">Email</div>
                                    <a
                                        href={`mailto:${profile.email}`}
                                        className="text-gray-400 hover:text-cyan-400 transition-colors"
                                    >
                                        {profile.email}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div>
                                    <div className="font-semibold text-white">Location</div>
                                    <div className="text-gray-400">{profile.location}</div>
                                </div>
                            </div>

                            {socialLinks.length > 0 && (
                                <div className="flex gap-3 pt-4">
                                    {socialLinks.map((link) => (
                                        <a
                                            key={link.id}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300"
                                            aria-label={link.platform}
                                        >
                                            <SocialIcon platform={link.icon} className="w-5 h-5" />
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </MotionFade>

                    {/* Contact Form */}
                    <MotionFade direction="right">
                        <div className="card-neon p-8">
                            <form onSubmit={handleContactSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="contact-name" className="block text-sm font-medium text-gray-300 mb-2">
                                        Name
                                    </label>
                                    <input
                                        id="contact-name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        disabled={formStatus === 'submitting'}
                                        placeholder="Your name"
                                        className="input-dark disabled:opacity-50"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="contact-email" className="block text-sm font-medium text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <input
                                        id="contact-email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        disabled={formStatus === 'submitting'}
                                        placeholder="your@email.com"
                                        className="input-dark disabled:opacity-50"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="contact-message" className="block text-sm font-medium text-gray-300 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="contact-message"
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                        disabled={formStatus === 'submitting'}
                                        placeholder="Tell me about your project or opportunity..."
                                        className="input-dark disabled:opacity-50 resize-none"
                                    />
                                </div>

                                {formMessage && (
                                    <div
                                        className={`p-3 rounded-lg text-sm ${
                                            formStatus === 'success'
                                                ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300'
                                                : 'bg-red-500/10 border border-red-500/30 text-red-400'
                                        }`}
                                    >
                                        {formMessage}
                                    </div>
                                )}

                                <motion.button
                                    type="submit"
                                    disabled={formStatus === 'submitting'}
                                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Send className="w-4 h-4" />
                                    {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                                </motion.button>
                            </form>
                        </div>
                    </MotionFade>
                </div>
            </div>
        </section>
    );
}
