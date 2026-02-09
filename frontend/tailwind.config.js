/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Dark base system
                dark: {
                    950: '#030712',
                    900: '#0a0f1e',
                    800: '#111827',
                    700: '#1a2332',
                    600: '#243044',
                    500: '#334155',
                },
                // Cyan / Electric blue primary accent
                cyan: {
                    50: '#ecfeff',
                    100: '#cffafe',
                    200: '#a5f3fc',
                    300: '#67e8f9',
                    400: '#22d3ee',
                    500: '#06b6d4',
                    600: '#0891b2',
                    700: '#0e7490',
                    800: '#155e75',
                    900: '#164e63',
                    950: '#083344',
                },
                // Electric blue secondary (for gradients)
                electric: {
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                },
                // Neon green for terminal-like accents
                neon: {
                    400: '#4ade80',
                    500: '#22c55e',
                },
                // Violet accent for gradient tails
                accent: {
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#7c3aed',
                },
                // Keep primary as alias for cyan for backward compat in admin
                primary: {
                    50: '#ecfeff',
                    100: '#cffafe',
                    200: '#a5f3fc',
                    300: '#67e8f9',
                    400: '#22d3ee',
                    500: '#06b6d4',
                    600: '#0891b2',
                    700: '#0e7490',
                    800: '#155e75',
                    900: '#164e63',
                    950: '#083344',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
                display: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'shimmer': 'shimmer 3s linear infinite',
                'border-glow': 'border-glow 3s ease-in-out infinite',
                'fade-in': 'fadeIn 0.6s ease-out',
                'slide-up': 'slideUp 0.6s ease-out',
                'scan-line': 'scan-line 4s linear infinite',
                'blink': 'blink 1s step-end infinite',
                'scroll-indicator': 'scroll-indicator 1.5s ease-in-out infinite',
            },
            keyframes: {
                'glow-pulse': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(6, 182, 212, 0.6)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '200% 0' },
                    '100%': { backgroundPosition: '-200% 0' },
                },
                'border-glow': {
                    '0%, 100%': { borderColor: 'rgba(6, 182, 212, 0.3)' },
                    '50%': { borderColor: 'rgba(6, 182, 212, 0.8)' },
                },
                fadeIn: {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    from: { opacity: '0', transform: 'translateY(40px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                'scan-line': {
                    '0%': { transform: 'translateY(-100%)', opacity: '0' },
                    '50%': { opacity: '1' },
                    '100%': { transform: 'translateY(100%)', opacity: '0' },
                },
                blink: {
                    '0%, 50%': { opacity: '1' },
                    '51%, 100%': { opacity: '0' },
                },
                'scroll-indicator': {
                    '0%': { opacity: '1', transform: 'translateX(-50%) translateY(0)' },
                    '100%': { opacity: '0', transform: 'translateX(-50%) translateY(16px)' },
                },
            },
            backgroundImage: {
                'grid-pattern': 'linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px)',
                'dot-pattern': 'radial-gradient(rgba(6, 182, 212, 0.15) 1px, transparent 1px)',
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            },
            backgroundSize: {
                'grid': '60px 60px',
                'dot': '20px 20px',
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        maxWidth: 'none',
                        color: theme('colors.gray.300'),
                        a: {
                            color: theme('colors.cyan.400'),
                            '&:hover': { color: theme('colors.cyan.300') },
                        },
                        code: {
                            color: theme('colors.cyan.300'),
                            backgroundColor: theme('colors.dark.700'),
                            padding: '0.25rem 0.375rem',
                            borderRadius: '0.25rem',
                            fontWeight: '500',
                        },
                        'code::before': { content: '""' },
                        'code::after': { content: '""' },
                        strong: { color: theme('colors.gray.100') },
                        'h1, h2, h3, h4, h5, h6': { color: theme('colors.gray.100') },
                        blockquote: {
                            color: theme('colors.gray.400'),
                            borderLeftColor: theme('colors.cyan.500'),
                        },
                        hr: { borderColor: theme('colors.dark.600') },
                        'ol > li::marker': { color: theme('colors.cyan.400') },
                        'ul > li::marker': { color: theme('colors.cyan.400') },
                        thead: {
                            borderBottomColor: theme('colors.dark.600'),
                        },
                        'tbody tr': {
                            borderBottomColor: theme('colors.dark.700'),
                        },
                    },
                },
            }),
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
