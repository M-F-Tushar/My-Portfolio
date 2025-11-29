import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import SEO from '@/components/SEO';
import { AuthProvider } from '@/lib/AuthContext';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const isAdminPage = router.pathname.startsWith('/admin');

    return (
        <ErrorBoundary>
            <AuthProvider>
                <SEO />

                {isAdminPage ? (
                    // Admin pages have their own layout
                    <Component {...pageProps} />
                ) : (
                    // Public pages with Nav and Footer
                    <div className="flex flex-col min-h-screen">
                        <Nav />
                        <main className="flex-grow">
                            <Component {...pageProps} />
                        </main>
                        <Footer />
                    </div>
                )}
            </AuthProvider>
        </ErrorBoundary>
    );
}
