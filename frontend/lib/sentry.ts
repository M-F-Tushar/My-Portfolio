/**
 * Sentry Error Tracking Configuration
 * Captures and reports errors from both client and server
 * 
 * Setup:
 * 1. Install Sentry: npm install @sentry/nextjs
 * 2. Create account at https://sentry.io
 * 3. Create a new Next.js project
 * 4. Add NEXT_PUBLIC_SENTRY_DSN to your environment variables
 * 
 * Note: This module provides a graceful fallback when Sentry is not installed.
 */

// Type definitions for Sentry-like API
export type SeverityLevel = 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const ENVIRONMENT = process.env.NODE_ENV || 'development';
const RELEASE = process.env.npm_package_version || '1.0.0';

// Check if Sentry should be initialized
const shouldInitialize = Boolean(
    SENTRY_DSN && 
    (ENVIRONMENT === 'production' || process.env.ENABLE_SENTRY === 'true')
);

// Store reference to Sentry module if available
let SentryModule: {
    init: (config: Record<string, unknown>) => void;
    captureException: (error: Error) => void;
    captureMessage: (message: string, level?: SeverityLevel) => void;
    setUser: (user: { id: string; email?: string; username?: string } | null) => void;
    addBreadcrumb: (breadcrumb: Record<string, unknown>) => void;
    withScope: (callback: (scope: { setExtra: (key: string, value: unknown) => void }) => void) => void;
    startTransaction: (context: { name: string; op: string }) => { finish: () => void } | null;
} | null = null;

// Try to load Sentry dynamically
if (shouldInitialize && typeof window !== 'undefined') {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        SentryModule = require('@sentry/nextjs');
    } catch {
        console.warn('Sentry SDK not installed. Run: npm install @sentry/nextjs');
    }
}

/**
 * Initialize Sentry for client-side error tracking
 */
export function initSentryClient(): void {
    if (!shouldInitialize || !SentryModule) {
        if (ENVIRONMENT === 'development') {
            console.log('Sentry client initialization skipped');
        }
        return;
    }

    SentryModule.init({
        dsn: SENTRY_DSN,
        environment: ENVIRONMENT,
        release: `portfolio@${RELEASE}`,
        tracesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        ignoreErrors: [
            'Network request failed',
            'Failed to fetch',
            'NetworkError',
            'Load failed',
            'ResizeObserver loop limit exceeded',
            'AbortError',
        ],
    });
}

/**
 * Initialize Sentry for server-side error tracking
 */
export function initSentryServer(): void {
    if (!shouldInitialize) {
        if (ENVIRONMENT === 'development') {
            console.log('Sentry server initialization skipped');
        }
        return;
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const ServerSentry = require('@sentry/nextjs');
        ServerSentry.init({
            dsn: SENTRY_DSN,
            environment: ENVIRONMENT,
            release: `portfolio@${RELEASE}`,
            tracesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,
        });
    } catch {
        console.warn('Sentry SDK not installed for server.');
    }
}

/**
 * Capture custom error with context
 */
export function captureError(error: Error, context?: Record<string, unknown>): void {
    if (!SentryModule) {
        console.error('Error:', error.message, context);
        return;
    }

    SentryModule.withScope((scope) => {
        if (context) {
            Object.entries(context).forEach(([key, value]) => {
                scope.setExtra(key, value);
            });
        }
        SentryModule?.captureException(error);
    });
}

/**
 * Capture custom message
 */
export function captureMessage(message: string, level: SeverityLevel = 'info'): void {
    if (!SentryModule) {
        console.log(`[${level}]:`, message);
        return;
    }

    SentryModule.captureMessage(message, level);
}

/**
 * Set user context for error tracking
 */
export function setUser(user: { id: string; email?: string; username?: string } | null): void {
    if (!SentryModule) return;
    SentryModule.setUser(user);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
    message: string,
    category: string,
    data?: Record<string, unknown>,
    level: SeverityLevel = 'info'
): void {
    if (!SentryModule) return;

    SentryModule.addBreadcrumb({
        message,
        category,
        data,
        level,
    });
}

/**
 * Create transaction for performance monitoring
 */
export function startTransaction(name: string, op: string): { finish: () => void } | null {
    if (!SentryModule) return null;
    return SentryModule.startTransaction({ name, op });
}

export default {
    initSentryClient,
    initSentryServer,
    captureError,
    captureMessage,
    setUser,
    addBreadcrumb,
    startTransaction,
};
