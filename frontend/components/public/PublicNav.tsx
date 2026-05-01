import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/db';
import { hasDatabaseUrl } from '@/lib/env';

async function getPublicNavSettings() {
    if (!hasDatabaseUrl()) {
        return null;
    }

    try {
        return await prisma.siteSettings.findUnique({
            where: { id: 1 },
            select: {
                siteName: true,
                showDemosInNav: true,
            },
        });
    } catch {
        return null;
    }
}

export default async function PublicNav() {
    const siteSettings = await getPublicNavSettings();
    const siteName = siteSettings?.siteName ?? 'Portfolio';
    const showDemosInNav = siteSettings?.showDemosInNav ?? false;

    const links = [
        { label: 'Home', href: '/' },
        { label: 'Projects', href: '/projects' },
        ...(showDemosInNav ? [{ label: 'Demos', href: '/demos' }] : []),
        { label: 'Resume', href: '/resume' },
        { label: 'Contact', href: '/#contact' },
    ];

    return (
        <nav className="sticky top-0 z-40 border-b border-white/5 bg-dark-950/82 backdrop-blur-xl">
            <div className="container-wide flex h-16 items-center justify-between gap-4">
                <Link
                    href="/"
                    className="group inline-flex min-w-0 items-center gap-3 text-slate-100 transition hover:text-white focus-ring"
                >
                    <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.85)]" />
                    <span className="grid min-w-0">
                        <span className="truncate text-sm font-semibold uppercase tracking-[0.22em]">{siteName}</span>
                        <span className="hidden text-[0.7rem] font-medium text-cyan-200 sm:block">AI/ML portfolio</span>
                    </span>
                </Link>

                <div className="hidden items-center gap-1 rounded-full border border-cyan-200/15 bg-slate-950/70 p-1 md:flex">
                    {links.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="rounded-full px-3 py-1.5 text-sm text-slate-300 transition hover:bg-cyan-200/10 hover:text-white focus-ring"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <Link
                    href="/#contact"
                    className="hidden items-center gap-2 rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 lg:inline-flex"
                >
                    Let&apos;s Talk
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
            <div className="border-t border-white/5 md:hidden">
                <div className="container-wide flex gap-2 overflow-x-auto py-2">
                    {links.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="shrink-0 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 transition hover:border-cyan-200/40 hover:text-white focus-ring"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
