import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import SEO from '@/components/SEO';
import SkipLink from '@/components/SkipLink';
import { AuthProvider } from '@/lib/AuthContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import { initGA, trackPageView } from '@/lib/analytics';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const isAdminPage = router.pathname.startsWith('/admin');

    // Initialize Google Analytics
    useEffect(() => {
        initGA();
    }, []);

    // Track page views on route change
    useEffect(() => {
        const handleRouteChange = (url: string) => {
            trackPageView(url);
        };

        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router.events]);

    return (
        <ErrorBoundary>
            <ThemeProvider>
                <AuthProvider>
                    <SEO />
                    <SkipLink />

                    {isAdminPage ? (
                        // Admin pages have their own layout
                        <Component {...pageProps} />
                    ) : (
                        // Public pages with Nav and Footer
                        <div className="flex flex-col min-h-screen">
                            <Nav />
                            <main id="main-content" className="flex-grow">
                                <Component {...pageProps} />
                            </main>
                            <Footer />
                        </div>
                    )}
                </AuthProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}
