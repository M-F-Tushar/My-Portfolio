import Head from 'next/head';
import { siteConfig, getFullUrl, getImageUrl } from '@/lib/config';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'profile' | 'article';
    author?: string;
    keywords?: string[];
    publishedTime?: string;
    modifiedTime?: string;
    noIndex?: boolean;
}

export type { SEOProps };

export default function SEO({
    title = siteConfig.name,
    description = siteConfig.defaultDescription,
    image = siteConfig.defaultImage,
    url = '',
    type = 'website',
    author = siteConfig.author,
    keywords = siteConfig.defaultKeywords,
    publishedTime,
    modifiedTime,
    noIndex = false,
}: SEOProps) {
    const fullTitle = title.includes('Portfolio') ? title : `${title} | ${siteConfig.name}`;
    const fullUrl = url.startsWith('http') ? url : getFullUrl(url);
    const fullImage = getImageUrl(image);

    // Structured Data (JSON-LD) for Person/Professional
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: author,
        jobTitle: 'AI/ML Engineer',
        description: description,
        url: fullUrl,
        image: fullImage,
        sameAs: [
            // These will be populated from database in production
        ],
        knowsAbout: keywords,
    };

    return (
        <Head>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords.join(', ')} />
            <meta name="author" content={author} />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="language" content="English" />
            <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
            <meta name="googlebot" content="index, follow" />

            {/* Canonical URL */}
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="AI/ML Portfolio" />
            <meta property="og:locale" content="en_US" />

            {publishedTime && <meta property="article:published_time" content={publishedTime} />}
            {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={fullUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImage} />
            {siteConfig.twitterHandle && (
                <meta name="twitter:creator" content={`@${siteConfig.twitterHandle}`} />
            )}

            {/* Additional Meta Tags */}
            <meta name="theme-color" content={siteConfig.themeColor} />
            <meta name="msapplication-TileColor" content="#06b6d4" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

            {/* Favicon */}
            <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="manifest" href="/site.webmanifest" />

            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            {/* Preconnect to external domains for performance */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </Head>
    );
}
