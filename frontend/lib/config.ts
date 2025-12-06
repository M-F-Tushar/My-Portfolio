/**
 * Centralized Environment Configuration
 * 
 * This file provides type-safe access to environment variables
 * with sensible defaults for development.
 */

// Site Configuration
export const siteConfig = {
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    name: process.env.NEXT_PUBLIC_SITE_NAME || 'AI/ML Portfolio',
    author: process.env.NEXT_PUBLIC_SITE_AUTHOR || 'AI/ML Engineer',
    twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '',
    
    // SEO defaults
    defaultDescription: 'Professional AI/ML Engineer Portfolio showcasing expertise in Large Language Models, Deep Learning, and Production ML Systems',
    defaultKeywords: ['AI', 'ML', 'Machine Learning', 'Deep Learning', 'LLM', 'Portfolio', 'Data Science'] as string[],
    defaultImage: '/og-image.png',
    
    // Theme
    themeColor: '#667eea',
} as const;

// API Configuration
export const apiConfig = {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    timeout: 30000, // 30 seconds
} as const;

// Security Configuration (server-side only)
export const securityConfig = {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    csrfSecret: process.env.CSRF_SECRET || 'csrf-secret-change-in-production',
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
        .split(',')
        .map(origin => origin.trim()),
    
    // Rate limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100, // limit each IP to 100 requests per windowMs
    },
    
    // Session
    sessionMaxAge: 60 * 60 * 24 * 7, // 7 days in seconds
} as const;

// Feature Flags
export const features = {
    analyticsEnabled: !!process.env.NEXT_PUBLIC_GA_ID,
    contactFormEnabled: true,
    agentEnabled: process.env.NEXT_PUBLIC_AGENT_ENABLED === 'true',
} as const;

// Helper function to get full URL
export function getFullUrl(path: string = ''): string {
    const base = siteConfig.url.replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${cleanPath}`;
}

// Helper function to get full image URL
export function getImageUrl(image: string): string {
    if (image.startsWith('http')) return image;
    return getFullUrl(image);
}

// Validate required environment variables in production
export function validateEnv(): void {
    if (process.env.NODE_ENV === 'production') {
        const required = [
            'NEXT_PUBLIC_SITE_URL',
            'JWT_SECRET',
            'DATABASE_URL',
        ];
        
        const missing = required.filter(key => !process.env[key]);
        
        if (missing.length > 0) {
            throw new Error(
                `Missing required environment variables: ${missing.join(', ')}`
            );
        }
        
        // Warn about insecure defaults
        if (process.env.JWT_SECRET?.includes('change-in-production')) {
            console.warn('⚠️  Warning: Using default JWT_SECRET in production is insecure!');
        }
    }
}

export default siteConfig;
