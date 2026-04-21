import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
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
                        <Component {...pageProps} />
                    ) : (
                        <div className="flex flex-col min-h-screen">
                            <Nav />
                            <AnimatePresence mode="wait">
                                <motion.main
                                    key={router.asPath}
                                    id="main-content"
                                    className="flex-grow"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                                >
                                    <Component {...pageProps} />
                                </motion.main>
                            </AnimatePresence>
                            <Footer />
                        </div>
                    )}
                </AuthProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}
