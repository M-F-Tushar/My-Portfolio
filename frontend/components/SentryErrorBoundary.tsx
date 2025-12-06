/**
 * Sentry-Aware Error Boundary
 * Catches React errors and reports them to Sentry
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { captureError, addBreadcrumb } from '../lib/sentry';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class SentryErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.setState({ errorInfo });

        // Add breadcrumb for context
        addBreadcrumb(
            'Error caught by boundary',
            'error',
            {
                componentStack: errorInfo.componentStack,
            },
            'error'
        );

        // Report to Sentry
        captureError(error, {
            componentStack: errorInfo.componentStack,
            errorBoundary: true,
        });

        // Call optional error handler
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // Log in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Error caught by SentryErrorBoundary:', error);
            console.error('Component Stack:', errorInfo.componentStack);
        }
    }

    handleRetry = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Render custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="min-h-[400px] flex items-center justify-center p-8">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-red-600 dark:text-red-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Something went wrong
                        </h2>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            We apologize for the inconvenience. The error has been reported and we&apos;re working on a fix.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={this.handleRetry}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Try Again
                            </button>
                            
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                            >
                                Reload Page
                            </button>
                        </div>

                        {/* Show error details in development */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mt-6 text-left">
                                <details className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                                    <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Error Details (Development Only)
                                    </summary>
                                    <pre className="mt-4 text-xs text-red-600 dark:text-red-400 overflow-auto max-h-64">
                                        {this.state.error.toString()}
                                        {this.state.errorInfo?.componentStack}
                                    </pre>
                                </details>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * Hook for error handling in functional components
 */
export function useErrorHandler() {
    return {
        captureError: (error: Error, context?: Record<string, unknown>) => {
            captureError(error, context);
        },
        captureMessage: (message: string) => {
            addBreadcrumb(message, 'message', undefined, 'info');
        },
    };
}

export default SentryErrorBoundary;
