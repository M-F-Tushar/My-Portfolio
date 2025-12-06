/**
 * Admin Analytics Dashboard
 * Displays page views, popular content, and contact form stats
 */
import React, { useState, useEffect } from 'react';

// Types
interface PageViewData {
    path: string;
    views: number;
    uniqueVisitors: number;
    avgTimeOnPage: number;
}

interface ContactStats {
    total: number;
    unread: number;
    thisWeek: number;
    thisMonth: number;
}

interface ChartData {
    label: string;
    value: number;
}

interface AnalyticsData {
    overview: {
        totalPageViews: number;
        uniqueVisitors: number;
        avgSessionDuration: number;
        bounceRate: number;
    };
    pageViews: PageViewData[];
    dailyViews: ChartData[];
    topReferrers: ChartData[];
    deviceBreakdown: ChartData[];
    contactStats: ContactStats;
}

// Mock data generator (replace with actual analytics API)
function generateMockData(): AnalyticsData {
    return {
        overview: {
            totalPageViews: 12450,
            uniqueVisitors: 4230,
            avgSessionDuration: 185,
            bounceRate: 42.5,
        },
        pageViews: [
            { path: '/', views: 4500, uniqueVisitors: 2100, avgTimeOnPage: 45 },
            { path: '/projects', views: 2800, uniqueVisitors: 1200, avgTimeOnPage: 120 },
            { path: '/about', views: 1800, uniqueVisitors: 950, avgTimeOnPage: 90 },
            { path: '/blog', views: 1500, uniqueVisitors: 800, avgTimeOnPage: 180 },
            { path: '/contact', views: 1200, uniqueVisitors: 600, avgTimeOnPage: 60 },
        ],
        dailyViews: [
            { label: 'Mon', value: 450 },
            { label: 'Tue', value: 520 },
            { label: 'Wed', value: 480 },
            { label: 'Thu', value: 600 },
            { label: 'Fri', value: 550 },
            { label: 'Sat', value: 380 },
            { label: 'Sun', value: 320 },
        ],
        topReferrers: [
            { label: 'Google', value: 2500 },
            { label: 'GitHub', value: 1200 },
            { label: 'LinkedIn', value: 800 },
            { label: 'Twitter', value: 400 },
            { label: 'Direct', value: 1800 },
        ],
        deviceBreakdown: [
            { label: 'Desktop', value: 58 },
            { label: 'Mobile', value: 35 },
            { label: 'Tablet', value: 7 },
        ],
        contactStats: {
            total: 45,
            unread: 3,
            thisWeek: 8,
            thisMonth: 23,
        },
    };
}

// Stat Card Component
function StatCard({
    title,
    value,
    change,
    changeType = 'neutral',
    icon,
}: {
    title: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon?: React.ReactNode;
}) {
    const changeColors = {
        positive: 'text-green-600 dark:text-green-400',
        negative: 'text-red-600 dark:text-red-400',
        neutral: 'text-gray-600 dark:text-gray-400',
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>
                    {change && (
                        <p className={`text-sm mt-1 ${changeColors[changeType]}`}>
                            {changeType === 'positive' && '↑ '}
                            {changeType === 'negative' && '↓ '}
                            {change}
                        </p>
                    )}
                </div>
                {icon && (
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}

// Simple Bar Chart Component
function BarChart({
    data,
    title,
    className = '',
}: {
    data: ChartData[];
    title: string;
    className?: string;
}) {
    const maxValue = Math.max(...data.map((d) => d.value));

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
            <div className="space-y-3">
                {data.map((item, index) => (
                    <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {item.value.toLocaleString()}
                            </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                                style={{ width: `${(item.value / maxValue) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Donut Chart Component (CSS-based)
function DonutChart({
    data,
    title,
    className = '',
}: {
    data: ChartData[];
    title: string;
    className?: string;
}) {
    const total = data.reduce((acc, d) => acc + d.value, 0);
    const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];
    
    let cumulativePercent = 0;
    const segments = data.map((item, index) => {
        const percent = (item.value / total) * 100;
        const segment = {
            ...item,
            percent,
            offset: cumulativePercent,
            color: colors[index % colors.length],
        };
        cumulativePercent += percent;
        return segment;
    });

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
            
            <div className="flex items-center justify-center gap-8">
                {/* Donut */}
                <div className="relative w-32 h-32">
                    <svg viewBox="0 0 36 36" className="w-full h-full">
                        {segments.map((segment, index) => (
                            <circle
                                key={index}
                                cx="18"
                                cy="18"
                                r="16"
                                fill="none"
                                stroke={segment.color}
                                strokeWidth="3"
                                strokeDasharray={`${segment.percent} ${100 - segment.percent}`}
                                strokeDashoffset={-segment.offset}
                                transform="rotate(-90 18 18)"
                                className="transition-all duration-500"
                            />
                        ))}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {total}%
                        </span>
                    </div>
                </div>

                {/* Legend */}
                <div className="space-y-2">
                    {segments.map((segment, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: segment.color }}
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {segment.label}
                            </span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {segment.percent.toFixed(0)}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Page Views Table
function PageViewsTable({ data }: { data: PageViewData[] }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Top Pages
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700/50">
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Page
                            </th>
                            <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Views
                            </th>
                            <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Unique
                            </th>
                            <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Avg. Time
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {data.map((page, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <td className="px-6 py-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                                    {page.path}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-right">
                                    {page.views.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-right">
                                    {page.uniqueVisitors.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-right">
                                    {Math.floor(page.avgTimeOnPage / 60)}:
                                    {String(page.avgTimeOnPage % 60).padStart(2, '0')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Format duration
function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
}

// Main Analytics Dashboard Component
export function AnalyticsDashboard({ className = '' }: { className?: string }) {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('7d');

    useEffect(() => {
        // Simulate API call
        setLoading(true);
        setTimeout(() => {
            setData(generateMockData());
            setLoading(false);
        }, 500);
    }, [dateRange]);

    if (loading) {
        return (
            <div className={`space-y-6 ${className}`}>
                {/* Loading skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                    Failed to load analytics data
                </p>
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header with Date Range Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Analytics Dashboard
                </h2>
                <div className="flex gap-2">
                    {(['7d', '30d', '90d'] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setDateRange(range)}
                            className={`
                                px-4 py-2 text-sm font-medium rounded-lg transition-colors
                                ${dateRange === range
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }
                            `}
                        >
                            {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Page Views"
                    value={data.overview.totalPageViews}
                    change="+12.5% from last period"
                    changeType="positive"
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Unique Visitors"
                    value={data.overview.uniqueVisitors}
                    change="+8.3% from last period"
                    changeType="positive"
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Avg. Session Duration"
                    value={formatDuration(data.overview.avgSessionDuration)}
                    change="+15s from last period"
                    changeType="positive"
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Bounce Rate"
                    value={`${data.overview.bounceRate}%`}
                    change="-2.1% from last period"
                    changeType="positive"
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    }
                />
            </div>

            {/* Contact Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                    <p className="text-sm opacity-80">Total Messages</p>
                    <p className="text-2xl font-bold">{data.contactStats.total}</p>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white">
                    <p className="text-sm opacity-80">Unread</p>
                    <p className="text-2xl font-bold">{data.contactStats.unread}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
                    <p className="text-sm opacity-80">This Week</p>
                    <p className="text-2xl font-bold">{data.contactStats.thisWeek}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                    <p className="text-sm opacity-80">This Month</p>
                    <p className="text-2xl font-bold">{data.contactStats.thisMonth}</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BarChart data={data.dailyViews} title="Daily Page Views" />
                <BarChart data={data.topReferrers} title="Top Referrers" />
            </div>

            {/* Device Breakdown & Page Views Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DonutChart data={data.deviceBreakdown} title="Device Breakdown" />
                <div className="lg:col-span-2">
                    <PageViewsTable data={data.pageViews} />
                </div>
            </div>
        </div>
    );
}

export default AnalyticsDashboard;
