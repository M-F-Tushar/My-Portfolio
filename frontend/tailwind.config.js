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
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                    950: '#082f49',
                },
                accent: {
                    50: '#fdf4ff',
                    100: '#fae8ff',
                    200: '#f5d0fe',
                    300: '#f0abfc',
                    400: '#e879f9',
                    500: '#d946ef',
                    600: '#c026d3',
                    700: '#a21caf',
                    800: '#86198f',
                    900: '#701a75',
                    950: '#4a044e',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['Fira Code', 'monospace'],
            },
            animation: {
                'shimmer': 'shimmer-slide 1.5s ease-in-out infinite',
                'fade-in': 'fadeIn 0.6s ease-out',
                'slide-up': 'slideUp 0.6s ease-out',
            },
            keyframes: {
                'shimmer-slide': {
                    'from': { backgroundPosition: '-200% 0' },
                    'to': { backgroundPosition: '200% 0' },
                },
                fadeIn: {
                    'from': { opacity: '0', transform: 'translateY(20px)' },
                    'to': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    'from': { opacity: '0', transform: 'translateY(40px)' },
                    'to': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        maxWidth: 'none',
                        color: theme('colors.gray.700'),
                        a: {
                            color: theme('colors.primary.600'),
                            '&:hover': {
                                color: theme('colors.primary.700'),
                            },
                        },
                        code: {
                            color: theme('colors.accent.600'),
                            backgroundColor: theme('colors.gray.100'),
                            padding: '0.25rem 0.375rem',
                            borderRadius: '0.25rem',
                            fontWeight: '500',
                        },
                        'code::before': {
                            content: '""',
                        },
                        'code::after': {
                            content: '""',
                        },
                    },
                },
                dark: {
                    css: {
                        color: theme('colors.gray.300'),
                        a: {
                            color: theme('colors.primary.400'),
                            '&:hover': {
                                color: theme('colors.primary.300'),
                            },
                        },
                        code: {
                            color: theme('colors.accent.400'),
                            backgroundColor: theme('colors.gray.800'),
                        },
                        'strong': {
                            color: theme('colors.gray.100'),
                        },
                        'h1, h2, h3, h4, h5, h6': {
                            color: theme('colors.gray.200'),
                        },
                    },
                },
            }),
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
