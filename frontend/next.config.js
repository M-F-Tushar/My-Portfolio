/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    eslint: {
        // Lint during builds to catch security and code quality issues
        ignoreDuringBuilds: false,
        dirs: ['pages', 'components', 'lib', 'hooks'],
    },

    // Security Headers
    async headers() {
        return [
            {
                // Apply to all routes
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY'
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin'
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            // Note: Next.js requires 'unsafe-inline' for inline scripts during hydration
                            // In production, consider using nonces via middleware for stricter CSP
                            process.env.NODE_ENV === 'development'
                                ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'"
                                : "script-src 'self' 'unsafe-inline'",
                            // Tailwind CSS requires 'unsafe-inline' for styles
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                            "font-src 'self' https://fonts.gstatic.com data:",
                            "img-src 'self' data: https: blob:",
                            "connect-src 'self' https://*.vercel.app https://*.supabase.co wss://*.supabase.co http://localhost:*",
                            "frame-ancestors 'none'",
                            "base-uri 'self'",
                            "form-action 'self'",
                            "upgrade-insecure-requests",
                        ].join('; ')
                    }
                ],
            },
        ];
    },

    async rewrites() {
        return [
            {
                source: '/sitemap.xml',
                destination: '/api/sitemap.xml',
            },
            {
                source: '/robots.txt',
                destination: '/api/robots.txt',
            },
        ];
    },

    // Image optimization configuration
    images: {
        domains: ['localhost'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
        // Modern image formats
        formats: ['image/avif', 'image/webp'],
        // Device sizes for responsive images
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        // Minimize layout shift
        minimumCacheTTL: 60,
    },

    webpack: (config) => {
        config.resolve.fallback = { fs: false, path: false };
        return config;
    },
};

module.exports = nextConfig;
