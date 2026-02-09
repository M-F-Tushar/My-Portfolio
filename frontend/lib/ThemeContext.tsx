/**
 * Theme Context for Dark Mode Support
 * 
 * Provides theme state management with:
 * - localStorage persistence
 * - System preference detection
 * - Smooth transitions
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    resolvedTheme: 'light' | 'dark';
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'portfolio-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('dark');
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');
    const [mounted, setMounted] = useState(false);

    // Get system preference
    const getSystemTheme = useCallback((): 'light' | 'dark' => {
        if (typeof window === 'undefined') return 'dark';
        return 'dark';
    }, []);

    // Resolve the actual theme based on setting
    const resolveTheme = useCallback((t: Theme): 'light' | 'dark' => {
        if (t === 'system') return getSystemTheme();
        return t;
    }, [getSystemTheme]);

    // Apply theme to document
    const applyTheme = useCallback((resolved: 'light' | 'dark') => {
        const root = document.documentElement;
        
        // Add transition class for smooth switching
        root.classList.add('theme-transition');
        
        if (resolved === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        
        // Update meta theme-color
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.setAttribute('content', resolved === 'dark' ? '#1f2937' : '#667eea');
        }
        
        // Remove transition class after animation
        setTimeout(() => {
            root.classList.remove('theme-transition');
        }, 300);
    }, []);

    // Set theme and persist
    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem(STORAGE_KEY, newTheme);
        
        const resolved = resolveTheme(newTheme);
        setResolvedTheme(resolved);
        applyTheme(resolved);
    }, [resolveTheme, applyTheme]);

    // Toggle between light and dark
    const toggleTheme = useCallback(() => {
        const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    }, [resolvedTheme, setTheme]);

    // Initialize on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
        const initialTheme = stored || 'system';
        
        setThemeState(initialTheme);
        const resolved = resolveTheme(initialTheme);
        setResolvedTheme(resolved);
        applyTheme(resolved);
        setMounted(true);
    }, [resolveTheme, applyTheme]);

    // Listen for system preference changes
    useEffect(() => {
        if (theme !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = () => {
            const resolved = getSystemTheme();
            setResolvedTheme(resolved);
            applyTheme(resolved);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme, getSystemTheme, applyTheme]);

    // Prevent flash of unstyled content
    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

export default ThemeContext;
