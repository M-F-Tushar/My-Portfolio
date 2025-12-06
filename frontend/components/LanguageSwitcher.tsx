/**
 * Language Switcher Component
 * Allows users to switch between supported languages
 */
import React, { useState, useRef, useEffect } from 'react';
import { useI18n, locales, localeNames, localeFlags, Locale } from '../lib/i18n';

interface LanguageSwitcherProps {
    className?: string;
    showLabel?: boolean;
    variant?: 'dropdown' | 'buttons' | 'minimal';
}

export function LanguageSwitcher({
    className = '',
    showLabel = false,
    variant = 'dropdown',
}: LanguageSwitcherProps) {
    const { locale, setLocale, t } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close on escape
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    if (variant === 'buttons') {
        return (
            <div className={`flex gap-1 ${className}`} role="group" aria-label={t('nav.changeLanguage')}>
                {locales.map((loc) => (
                    <button
                        key={loc}
                        onClick={() => setLocale(loc)}
                        className={`
                            px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                            ${locale === loc
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }
                        `}
                        aria-pressed={locale === loc}
                    >
                        <span className="mr-1">{localeFlags[loc]}</span>
                        {localeNames[loc]}
                    </button>
                ))}
            </div>
        );
    }

    if (variant === 'minimal') {
        return (
            <button
                onClick={() => {
                    const currentIndex = locales.indexOf(locale);
                    const nextIndex = (currentIndex + 1) % locales.length;
                    setLocale(locales[nextIndex]);
                }}
                className={`
                    p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                    text-gray-700 dark:text-gray-300
                    ${className}
                `}
                aria-label={t('nav.changeLanguage')}
                title={`Switch to ${localeNames[locales[(locales.indexOf(locale) + 1) % locales.length]]}`}
            >
                <span className="text-lg">{localeFlags[locale]}</span>
            </button>
        );
    }

    // Default: dropdown
    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="
                    flex items-center gap-2 px-3 py-2 rounded-lg
                    bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                    text-gray-700 dark:text-gray-300 transition-colors
                "
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-label={t('nav.changeLanguage')}
            >
                <span className="text-lg">{localeFlags[locale]}</span>
                {showLabel && (
                    <span className="text-sm font-medium">{localeNames[locale]}</span>
                )}
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {isOpen && (
                <div
                    className="
                        absolute right-0 mt-2 py-1 w-40
                        bg-white dark:bg-gray-800 rounded-lg shadow-lg
                        border border-gray-200 dark:border-gray-700
                        z-50
                    "
                    role="listbox"
                    aria-label="Select language"
                >
                    {locales.map((loc) => (
                        <button
                            key={loc}
                            onClick={() => {
                                setLocale(loc);
                                setIsOpen(false);
                            }}
                            className={`
                                w-full flex items-center gap-3 px-4 py-2 text-left
                                hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                                ${locale === loc
                                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                    : 'text-gray-700 dark:text-gray-300'
                                }
                            `}
                            role="option"
                            aria-selected={locale === loc}
                        >
                            <span className="text-lg">{localeFlags[loc]}</span>
                            <span className="text-sm font-medium">{localeNames[loc]}</span>
                            {locale === loc && (
                                <svg
                                    className="w-4 h-4 ml-auto text-blue-600 dark:text-blue-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default LanguageSwitcher;
