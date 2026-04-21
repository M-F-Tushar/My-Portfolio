import Link from 'next/link';
import { prisma } from '@/lib/db';

async function getPublicNavSettings() {
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
        <nav className="sticky top-0 z-40 border-b border-white/5 bg-dark-950/75 backdrop-blur-xl">
            <div className="container-wide flex h-16 items-center justify-between gap-6">
                <Link
                    href="/"
                    className="group inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.28em] text-slate-100 transition hover:text-white focus-ring"
                >
                    <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.85)]" />
                    <span>{siteName}</span>
                </Link>

                <div className="hidden items-center gap-2 md:flex">
                    {links.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="rounded-full px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white focus-ring"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
