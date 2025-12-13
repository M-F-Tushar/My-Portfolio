import { Github, Linkedin, Mail, Twitter, ExternalLink } from 'lucide-react';

interface SocialIconProps {
    platform: string;
    className?: string;
}

export default function SocialIcon({ platform, className = "w-6 h-6" }: SocialIconProps) {
    const name = platform.toLowerCase();

    switch (name) {
        case 'github': return <Github className={className} />;
        case 'linkedin': return <Linkedin className={className} />;
        case 'mail': return <Mail className={className} />;
        case 'email': return <Mail className={className} />;
        case 'twitter': return <Twitter className={className} />;
        case 'x': return <Twitter className={className} />;
        default: return <ExternalLink className={className} />;
    }
}
