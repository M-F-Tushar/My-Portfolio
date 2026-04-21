/**
 * Internationalization (i18n) Configuration
 * Lightweight i18n solution without external dependencies
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Supported locales
export const locales = ['en', 'bn'] as const;
export type Locale = typeof locales[number];

export const localeNames: Record<Locale, string> = {
    en: 'English',
    bn: 'বাংলা',
};

export const localeFlags: Record<Locale, string> = {
    en: '🇺🇸',
    bn: '🇧🇩',
};

// Default locale
export const defaultLocale: Locale = 'en';

// Translation type
type TranslationValue = string | { [key: string]: TranslationValue };
type Translations = Record<Locale, { [key: string]: TranslationValue }>;

// English translations
const en = {
    common: {
        home: 'Home',
        about: 'About',
        projects: 'Projects',
        skills: 'Skills',
        experience: 'Experience',
        education: 'Education',
        blog: 'Blog',
        contact: 'Contact',
        downloadCV: 'Download CV',
        viewMore: 'View More',
        viewProject: 'View Project',
        readMore: 'Read More',
        sendMessage: 'Send Message',
        loading: 'Loading...',
        error: 'An error occurred',
        success: 'Success!',
        cancel: 'Cancel',
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete',
        search: 'Search',
        filter: 'Filter',
        all: 'All',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
    },
    nav: {
        toggleTheme: 'Toggle Theme',
        changeLanguage: 'Change Language',
        openMenu: 'Open Menu',
        closeMenu: 'Close Menu',
    },
    hero: {
        greeting: 'Hello, I am',
        title: 'Full Stack Developer',
        subtitle: 'Building digital experiences that matter',
        cta: 'Get in Touch',
        scrollDown: 'Scroll Down',
    },
    about: {
        title: 'About Me',
        subtitle: 'Learn more about my journey',
        yearsExperience: 'Years of Experience',
        projectsCompleted: 'Projects Completed',
        happyClients: 'Happy Clients',
    },
    projects: {
        title: 'My Projects',
        subtitle: 'Check out my recent work',
        featured: 'Featured',
        viewLive: 'View Live',
        viewCode: 'View Code',
        technologies: 'Technologies',
        noProjects: 'No projects found',
    },
    skills: {
        title: 'Skills & Technologies',
        subtitle: 'My technical expertise',
        proficiency: 'Proficiency',
    },
    experience: {
        title: 'Work Experience',
        subtitle: 'My professional journey',
        present: 'Present',
    },
    education: {
        title: 'Education',
        subtitle: 'My academic background',
    },
    contact: {
        title: 'Get in Touch',
        subtitle: "Let's work together",
        name: 'Your Name',
        email: 'Your Email',
        subject: 'Subject',
        message: 'Your Message',
        send: 'Send Message',
        sending: 'Sending...',
        sent: 'Message sent successfully!',
        error: 'Failed to send message. Please try again.',
        placeholderName: 'John Doe',
        placeholderEmail: 'john@example.com',
        placeholderSubject: 'Project Inquiry',
        placeholderMessage: 'Tell me about your project...',
    },
    blog: {
        title: 'Blog',
        subtitle: 'Thoughts and insights',
        readTime: 'min read',
        publishedOn: 'Published on',
        noPosts: 'No blog posts yet',
        tags: 'Tags',
    },
    footer: {
        rights: 'All rights reserved',
        madeWith: 'Made with',
        by: 'by',
    },
    404: {
        title: 'Page Not Found',
        message: "The page you're looking for doesn't exist.",
        goHome: 'Go Home',
    },
};

// Bengali translations
const bn: typeof en = {
    common: {
        home: 'হোম',
        about: 'আমার সম্পর্কে',
        projects: 'প্রজেক্ট',
        skills: 'দক্ষতা',
        experience: 'অভিজ্ঞতা',
        education: 'শিক্ষা',
        blog: 'ব্লগ',
        contact: 'যোগাযোগ',
        downloadCV: 'সিভি ডাউনলোড',
        viewMore: 'আরও দেখুন',
        viewProject: 'প্রজেক্ট দেখুন',
        readMore: 'আরও পড়ুন',
        sendMessage: 'মেসেজ পাঠান',
        loading: 'লোড হচ্ছে...',
        error: 'একটি ত্রুটি ঘটেছে',
        success: 'সফল!',
        cancel: 'বাতিল',
        save: 'সংরক্ষণ',
        edit: 'সম্পাদনা',
        delete: 'মুছুন',
        search: 'অনুসন্ধান',
        filter: 'ফিল্টার',
        all: 'সব',
        back: 'পিছনে',
        next: 'পরবর্তী',
        previous: 'পূর্ববর্তী',
    },
    nav: {
        toggleTheme: 'থিম পরিবর্তন',
        changeLanguage: 'ভাষা পরিবর্তন',
        openMenu: 'মেনু খুলুন',
        closeMenu: 'মেনু বন্ধ করুন',
    },
    hero: {
        greeting: 'হ্যালো, আমি',
        title: 'ফুল স্ট্যাক ডেভেলপার',
        subtitle: 'অর্থবহ ডিজিটাল অভিজ্ঞতা তৈরি করি',
        cta: 'যোগাযোগ করুন',
        scrollDown: 'নিচে স্ক্রল করুন',
    },
    about: {
        title: 'আমার সম্পর্কে',
        subtitle: 'আমার যাত্রা সম্পর্কে জানুন',
        yearsExperience: 'বছরের অভিজ্ঞতা',
        projectsCompleted: 'সম্পন্ন প্রজেক্ট',
        happyClients: 'সন্তুষ্ট ক্লায়েন্ট',
    },
    projects: {
        title: 'আমার প্রজেক্ট',
        subtitle: 'আমার সাম্প্রতিক কাজ দেখুন',
        featured: 'বৈশিষ্ট্যযুক্ত',
        viewLive: 'লাইভ দেখুন',
        viewCode: 'কোড দেখুন',
        technologies: 'প্রযুক্তি',
        noProjects: 'কোন প্রজেক্ট পাওয়া যায়নি',
    },
    skills: {
        title: 'দক্ষতা ও প্রযুক্তি',
        subtitle: 'আমার প্রযুক্তিগত দক্ষতা',
        proficiency: 'দক্ষতা',
    },
    experience: {
        title: 'কাজের অভিজ্ঞতা',
        subtitle: 'আমার পেশাদার যাত্রা',
        present: 'বর্তমান',
    },
    education: {
        title: 'শিক্ষা',
        subtitle: 'আমার একাডেমিক পটভূমি',
    },
    contact: {
        title: 'যোগাযোগ করুন',
        subtitle: 'আসুন একসাথে কাজ করি',
        name: 'আপনার নাম',
        email: 'আপনার ইমেইল',
        subject: 'বিষয়',
        message: 'আপনার মেসেজ',
        send: 'মেসেজ পাঠান',
        sending: 'পাঠানো হচ্ছে...',
        sent: 'মেসেজ সফলভাবে পাঠানো হয়েছে!',
        error: 'মেসেজ পাঠাতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।',
        placeholderName: 'জন ডো',
        placeholderEmail: 'john@example.com',
        placeholderSubject: 'প্রজেক্ট সম্পর্কে জিজ্ঞাসা',
        placeholderMessage: 'আপনার প্রজেক্ট সম্পর্কে বলুন...',
    },
    blog: {
        title: 'ব্লগ',
        subtitle: 'চিন্তা ও অন্তর্দৃষ্টি',
        readTime: 'মিনিট পড়া',
        publishedOn: 'প্রকাশিত',
        noPosts: 'এখনও কোন ব্লগ পোস্ট নেই',
        tags: 'ট্যাগ',
    },
    footer: {
        rights: 'সর্বস্বত্ব সংরক্ষিত',
        madeWith: 'তৈরি করেছি',
        by: 'দ্বারা',
    },
    404: {
        title: 'পৃষ্ঠা পাওয়া যায়নি',
        message: 'আপনি যে পৃষ্ঠাটি খুঁজছেন তা বিদ্যমান নেই।',
        goHome: 'হোমে যান',
    },
};

const translations: Translations = { en, bn };

// i18n Context
interface I18nContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string, params?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

// Helper to get nested translation value
function getNestedValue(obj: Record<string, unknown>, path: string): string {
    const keys = path.split('.');
    let result: unknown = obj;
    
    for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
            result = (result as Record<string, unknown>)[key];
        } else {
            return path; // Return key if translation not found
        }
    }
    
    return typeof result === 'string' ? result : path;
}

// i18n Provider
export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(defaultLocale);

    // Load saved locale from localStorage
    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') as Locale | null;
        if (savedLocale && locales.includes(savedLocale)) {
            setLocaleState(savedLocale);
        } else {
            // Try to detect browser language
            const browserLang = navigator.language.split('-')[0] as Locale;
            if (locales.includes(browserLang)) {
                setLocaleState(browserLang);
            }
        }
    }, []);

    // Update document lang attribute
    useEffect(() => {
        document.documentElement.lang = locale;
        document.documentElement.dir = locale === 'bn' ? 'ltr' : 'ltr'; // Add 'rtl' support if needed
    }, [locale]);

    const setLocale = useCallback((newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('locale', newLocale);
    }, []);

    const t = useCallback((key: string, params?: Record<string, string>): string => {
        let translation = getNestedValue(
            translations[locale] as unknown as Record<string, unknown>,
            key
        );

        // Replace parameters like {{name}}
        if (params) {
            Object.entries(params).forEach(([param, value]) => {
                translation = translation.replace(new RegExp(`{{${param}}}`, 'g'), value);
            });
        }

        return translation;
    }, [locale]);

    return (
        <I18nContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </I18nContext.Provider>
    );
}

// Hook to use i18n
export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}

// Hook for translations only
export function useTranslation() {
    const { t } = useI18n();
    return { t };
}

export default I18nProvider;
