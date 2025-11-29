import Head from 'next/head';

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
}

export default function SEO({
    title = 'AI/ML Portfolio',
    description = 'Professional AI/ML Engineer Portfolio showcasing expertise in Large Language Models, Deep Learning, and Production ML Systems',
    image = '/og-image.png',
    url = 'https://yourportfolio.com',
    type = 'website',
    author = 'AI/ML Engineer',
    keywords = ['AI', 'ML', 'Machine Learning', 'Deep Learning', 'LLM', 'Portfolio', 'Data Science'],
    publishedTime,
    modifiedTime,
}: SEOProps) {
    const fullTitle = title.includes('Portfolio') ? title : `${title} | AI/ML Portfolio`;
    const fullUrl = url.startsWith('http') ? url : `https://yourportfolio.com${url}`;
    const fullImage = image.startsWith('http') ? image : `https://yourportfolio.com${image}`;

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
            <meta name="robots" content="index, follow" />
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
            <meta name="twitter:creator" content="@yourusername" />

            {/* Additional Meta Tags */}
            <meta name="theme-color" content="#667eea" />
            <meta name="msapplication-TileColor" content="#667eea" />
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
