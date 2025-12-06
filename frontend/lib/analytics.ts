/**
 * Google Analytics Integration
 * 
 * Provides GA4 tracking with:
 * - Page view tracking
 * - Event tracking
 * - Respects Do Not Track
 */

// GA4 Measurement ID from environment
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Check if analytics should be enabled
 */
export function isAnalyticsEnabled(): boolean {
    // Must have measurement ID
    if (!GA_MEASUREMENT_ID) return false;
    
    // Must be in browser
    if (typeof window === 'undefined') return false;
    
    // Respect Do Not Track
    if (navigator.doNotTrack === '1' || 
        (window as any).doNotTrack === '1') {
        return false;
    }
    
    return true;
}

/**
 * Initialize Google Analytics
 */
export function initGA(): void {
    if (!isAnalyticsEnabled()) return;

    // Load gtag.js script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
        (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
        page_location: window.location.href,
        page_title: document.title,
    });
}

/**
 * Track page view
 */
export function trackPageView(url: string, title?: string): void {
    if (!isAnalyticsEnabled()) return;
    
    const gtag = (window as any).gtag;
    if (!gtag) return;

    gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
        page_title: title || document.title,
    });
}

/**
 * Track custom event
 */
export function trackEvent(
    action: string,
    category: string,
    label?: string,
    value?: number
): void {
    if (!isAnalyticsEnabled()) return;
    
    const gtag = (window as any).gtag;
    if (!gtag) return;

    gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
    });
}

/**
 * Pre-defined event trackers
 */
export const analytics = {
    // Contact form events
    contactFormSubmit: () => trackEvent('submit', 'Contact Form', 'Contact Submission'),
    contactFormError: (error: string) => trackEvent('error', 'Contact Form', error),
    
    // Resume/CV events
    resumeDownload: () => trackEvent('download', 'Resume', 'Resume Download'),
    
    // Project events
    projectView: (projectName: string) => trackEvent('view', 'Project', projectName),
    projectDemoClick: (projectName: string) => trackEvent('demo_click', 'Project', projectName),
    projectRepoClick: (projectName: string) => trackEvent('repo_click', 'Project', projectName),
    
    // Social link clicks
    socialClick: (platform: string) => trackEvent('click', 'Social Link', platform),
    
    // Navigation events
    navClick: (section: string) => trackEvent('click', 'Navigation', section),
    
    // Demo page events
    chatDemoUse: () => trackEvent('use', 'Demo', 'Chat Demo'),
    agentDemoUse: () => trackEvent('use', 'Demo', 'Agent Demo'),
    
    // Blog events
    blogPostView: (postTitle: string) => trackEvent('view', 'Blog', postTitle),
    blogPostShare: (postTitle: string, platform: string) => 
        trackEvent('share', 'Blog', `${postTitle} - ${platform}`),
};

export default analytics;
