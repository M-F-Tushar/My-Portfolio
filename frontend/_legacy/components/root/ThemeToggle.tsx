/**
 * Theme Toggle Component
 * 
 * A button to switch between light, dark, and system themes.
 */

'use client';

import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

interface ThemeToggleProps {
    className?: string;
    showLabel?: boolean;
}

export default function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
    const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

    // Simple toggle between light and dark
    const handleClick = () => {
        toggleTheme();
    };

    // Cycle through all options on right-click or long press
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
    };

    const Icon = resolvedTheme === 'dark' ? Moon : Sun;
    const label = theme === 'system' ? 'System' : resolvedTheme === 'dark' ? 'Dark' : 'Light';

    return (
        <button
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            className={`
                relative p-2 rounded-lg transition-all duration-200
                hover:bg-gray-100 dark:hover:bg-gray-800
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                dark:focus:ring-offset-gray-900
                ${className}
            `}
            aria-label={`Toggle theme (current: ${label})`}
            title={`Current: ${label}. Click to toggle, right-click for options.`}
        >
            <div className="relative w-5 h-5">
                {/* Sun icon for light mode */}
                <Sun 
                    className={`
                        absolute inset-0 w-5 h-5 transition-all duration-300
                        ${resolvedTheme === 'dark' 
                            ? 'opacity-0 rotate-90 scale-0' 
                            : 'opacity-100 rotate-0 scale-100'
                        }
                        text-amber-500
                    `}
                />
                
                {/* Moon icon for dark mode */}
                <Moon 
                    className={`
                        absolute inset-0 w-5 h-5 transition-all duration-300
                        ${resolvedTheme === 'dark' 
                            ? 'opacity-100 rotate-0 scale-100' 
                            : 'opacity-0 -rotate-90 scale-0'
                        }
                        text-blue-400
                    `}
                />
            </div>
            
            {/* System indicator dot */}
            {theme === 'system' && (
                <span className="absolute bottom-0.5 right-0.5 w-2 h-2 bg-primary-500 rounded-full" />
            )}
            
            {showLabel && (
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </span>
            )}
        </button>
    );
}
