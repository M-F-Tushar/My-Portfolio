import { useState } from 'react';
import { Mail, MapPin } from 'lucide-react';
import { Profile, SocialLink } from '@prisma/client';
import SocialIcon from '../SocialIcon';

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
        <section id="contact" className="py-20 px-4 bg-gradient-to-br from-primary-600 to-accent-600 text-white">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold mb-8 text-center">
                    Get In <span className="text-accent-200">Touch</span>
                </h2>

                <p className="text-xl text-center text-primary-100 mb-12">
                    I&apos;m always open to new opportunities and interesting ML projects. Let&apos;s connect!
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Mail className="w-6 h-6" />
                            <div>
                                <div className="font-semibold">Email</div>
                                <a href={`mailto:${profile.email}`} className="text-primary-100 hover:text-white">
                                    {profile.email}
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <MapPin className="w-6 h-6" />
                            <div>
                                <div className="font-semibold">Location</div>
                                <div className="text-primary-100">{profile.location}</div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            {socialLinks.map((link) => (
                                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                                    className="p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                                    <SocialIcon platform={link.icon} className="w-6 h-6" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="card bg-white text-gray-900 p-6">
                        <form onSubmit={handleContactSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="contact-name" className="block text-sm font-medium mb-2">Name</label>
                                <input
                                    id="contact-name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    disabled={formStatus === 'submitting'}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                                />
                            </div>
                            <div>
                                <label htmlFor="contact-email" className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    id="contact-email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    disabled={formStatus === 'submitting'}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                                />
                            </div>
                            <div>
                                <label htmlFor="contact-message" className="block text-sm font-medium mb-2">Message</label>
                                <textarea
                                    id="contact-message"
                                    rows={4}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                    disabled={formStatus === 'submitting'}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                                ></textarea>
                            </div>
                            {formMessage && (
                                <div className={`p-3 rounded-lg text-sm ${formStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {formMessage}
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={formStatus === 'submitting'}
                                className="w-full btn-primary bg-primary-600 text-white hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
