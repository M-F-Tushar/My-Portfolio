'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    ArrowUpRight,
    Award,
    Briefcase,
    Code2,
    FolderKanban,
    GraduationCap,
    Inbox,
    LayoutDashboard,
    Medal,
    Settings,
    Sparkles,
    UserRound,
    FileText,
    PlaySquare,
    Share2,
} from 'lucide-react';
import SignOutButton from '@/components/admin/SignOutButton';

interface AdminShellProps {
    adminEmail: string;
    children: ReactNode;
}

interface NavItem {
    label: string;
    href: string;
    icon: typeof LayoutDashboard;
}

const navSections: { heading: string; items: NavItem[] }[] = [
    {
        heading: 'Overview',
        items: [{ label: 'Dashboard', href: '/admin', icon: LayoutDashboard }],
    },
    {
        heading: 'Site content',
        items: [
            { label: 'Profile', href: '/admin/profile', icon: UserRound },
            { label: 'Hero', href: '/admin/hero', icon: Sparkles },
            { label: 'Skills', href: '/admin/skills', icon: Code2 },
            { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
            { label: 'Demos', href: '/admin/demos', icon: PlaySquare },
        ],
    },
    {
        heading: 'Career',
        items: [
            { label: 'Experience', href: '/admin/experience', icon: Briefcase },
            { label: 'Education', href: '/admin/education', icon: GraduationCap },
            { label: 'Certifications', href: '/admin/certifications', icon: Award },
            { label: 'Achievements', href: '/admin/achievements', icon: Medal },
            { label: 'Resume', href: '/admin/resume', icon: FileText },
        ],
    },
    {
        heading: 'Contact',
        items: [
            { label: 'Social Links', href: '/admin/social', icon: Share2 },
            { label: 'Contact Inbox', href: '/admin/contact-submissions', icon: Inbox },
        ],
    },
    {
        heading: 'System',
        items: [{ label: 'Settings', href: '/admin/settings', icon: Settings }],
    },
];

export default function AdminShell({ adminEmail, children }: AdminShellProps) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
            <aside className="border-b border-white/10 bg-slate-950/95 lg:min-h-screen lg:border-b-0 lg:border-r">
                <div className="flex h-full flex-col">
                    <div className="border-b border-white/10 px-5 py-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                            Admin
                        </p>
                        <h1 className="mt-2 text-lg font-semibold text-white">Portfolio panel</h1>
                        <p className="mt-1 text-sm leading-6 text-slate-400">{adminEmail}</p>
                    </div>

                    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
                        {navSections.map((section) => (
                            <div key={section.heading} className="space-y-2">
                                <p className="px-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                    {section.heading}
                                </p>
                                <div className="space-y-1">
                                    {section.items.map((item) => {
                                        const Icon = item.icon;
                                        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={[
                                                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                                                    active
                                                        ? 'bg-cyan-400/10 text-cyan-100 ring-1 ring-inset ring-cyan-400/20'
                                                        : 'text-slate-300 hover:bg-white/5 hover:text-white',
                                                ].join(' ')}
                                            >
                                                <Icon className="h-4 w-4 shrink-0" />
                                                <span className="truncate">{item.label}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>

                    <div className="space-y-2 border-t border-white/10 px-4 py-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                        >
                            <ArrowUpRight className="h-4 w-4" />
                            View site
                        </Link>
                        <SignOutButton />
                    </div>
                </div>
            </aside>

            <div className="min-w-0">
                <header className="border-b border-white/10 bg-slate-950/80 px-5 py-4 backdrop-blur">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                                Owner workspace
                            </p>
                            <p className="mt-1 text-sm text-slate-400">Private admin content and publishing controls.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
                            >
                                <ArrowUpRight className="h-4 w-4" />
                                View site
                            </Link>
                            <SignOutButton compact />
                        </div>
                    </div>
                </header>

                <main className="px-5 py-6 sm:px-6 lg:px-8">{children}</main>
            </div>
        </div>
    );
}
