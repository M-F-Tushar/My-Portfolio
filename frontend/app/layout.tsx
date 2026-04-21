import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { prisma } from '@/lib/db';
import { env } from '@/lib/env';
import './globals.css';

async function getSiteMetadata() {
    try {
        return await prisma.siteSettings.findUnique({
            where: { id: 1 },
            select: {
                siteName: true,
                seoTitle: true,
                seoDescription: true,
            },
        });
    } catch {
        return null;
    }
}

export async function generateMetadata(): Promise<Metadata> {
    const siteSettings = await getSiteMetadata();
    const siteName = siteSettings?.siteName ?? 'Portfolio';
    const title = siteSettings?.seoTitle ?? siteName;
    const description =
        siteSettings?.seoDescription ??
        'A cinematic portfolio for AI engineering, machine learning, and systems work.';

    return {
        metadataBase: new URL(env.siteUrl),
        title: {
            default: title,
            template: `%s | ${siteName}`,
        },
        description,
        alternates: {
            canonical: '/',
        },
        openGraph: {
            title,
            description,
            url: env.siteUrl,
            siteName,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    };
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
