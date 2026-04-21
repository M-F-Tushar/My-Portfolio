import Link from 'next/link';

export default function Custom404() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 px-4">
            <div className="max-w-2xl w-full text-center text-white">
                {/* Animated 404 */}
                <div className="mb-8 animate-fadeIn">
                    <h1 className="text-9xl font-bold mb-4 animate-pulse-slow">404</h1>
                    <div className="text-6xl mb-6">🤖</div>
                </div>

                {/* Message */}
                <div className="animate-fadeIn stagger-1">
                    <h2 className="text-4xl font-bold mb-4">Page Not Found</h2>
                    <p className="text-xl text-primary-100 mb-8 max-w-md mx-auto">
                        Oops! The page you&apos;re looking for seems to have wandered off into the neural network.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn stagger-2">
                    <Link href="/" className="btn-primary bg-white text-primary-700 hover:bg-primary-50">
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="btn-secondary bg-primary-800 text-white hover:bg-primary-900"
                    >
                        Go Back
                    </button>
                </div>

                {/* Helpful Links */}
                <div className="mt-12 pt-8 border-t border-white/20 animate-fadeIn stagger-3">
                    <p className="text-primary-100 mb-4">You might be looking for:</p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <Link href="/#about" className="hover:text-accent-200 transition-colors">
                            About
                        </Link>
                        <Link href="/#projects" className="hover:text-accent-200 transition-colors">
                            Projects
                        </Link>
                        <Link href="/#experience" className="hover:text-accent-200 transition-colors">
                            Experience
                        </Link>
                        <Link href="/#contact" className="hover:text-accent-200 transition-colors">
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
