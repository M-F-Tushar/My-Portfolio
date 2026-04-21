/**
 * GitHub Activity Widget
 * Displays recent GitHub activity and repository stats
 */
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Repository {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    updated_at: string;
    topics: string[];
}

interface GitHubStats {
    public_repos: number;
    followers: number;
    following: number;
    total_stars: number;
}

interface GitHubActivityProps {
    username: string;
    maxRepos?: number;
    showStats?: boolean;
    className?: string;
}

// Language color mapping
const languageColors: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Rust: '#dea584',
    Go: '#00ADD8',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    HTML: '#e34c26',
    CSS: '#1572B6',
    Shell: '#89e051',
    Ruby: '#701516',
    PHP: '#4F5D95',
    Swift: '#ffac45',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
};

export function GitHubActivity({
    username,
    maxRepos = 6,
    showStats = true,
    className = '',
}: GitHubActivityProps) {
    const [repos, setRepos] = useState<Repository[]>([]);
    const [stats, setStats] = useState<GitHubStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchGitHubData() {
            try {
                setLoading(true);
                setError(null);

                // Fetch user profile
                const userResponse = await fetch(
                    `https://api.github.com/users/${username}`
                );

                if (!userResponse.ok) {
                    throw new Error('Failed to fetch GitHub profile');
                }

                const userData = await userResponse.json();

                // Fetch repositories
                const reposResponse = await fetch(
                    `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
                );

                if (!reposResponse.ok) {
                    throw new Error('Failed to fetch repositories');
                }

                const reposData: Repository[] = await reposResponse.json();

                // Calculate total stars
                const totalStars = reposData.reduce(
                    (acc, repo) => acc + repo.stargazers_count,
                    0
                );

                setStats({
                    public_repos: userData.public_repos,
                    followers: userData.followers,
                    following: userData.following,
                    total_stars: totalStars,
                });

                // Sort by stars and get top repos
                const sortedRepos = [...reposData]
                    .sort((a, b) => b.stargazers_count - a.stargazers_count)
                    .slice(0, maxRepos);

                setRepos(sortedRepos);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        }

        if (username) {
            fetchGitHubData();
        }
    }, [username, maxRepos]);

    if (loading) {
        return (
            <div className={`${className}`}>
                <div className="animate-pulse space-y-4">
                    {showStats && (
                        <div className="flex gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-16 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg"
                                />
                            ))}
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(maxRepos)].map((_, i) => (
                            <div
                                key={i}
                                className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${className} text-center py-8`}>
                <p className="text-red-500 dark:text-red-400">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className={className}>
            {/* GitHub Stats */}
            {showStats && stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        icon="📦"
                        label="Repositories"
                        value={stats.public_repos}
                    />
                    <StatCard
                        icon="⭐"
                        label="Total Stars"
                        value={stats.total_stars}
                    />
                    <StatCard
                        icon="👥"
                        label="Followers"
                        value={stats.followers}
                    />
                    <StatCard
                        icon="➕"
                        label="Following"
                        value={stats.following}
                    />
                </div>
            )}

            {/* Repository Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {repos.map((repo) => (
                    <RepoCard key={repo.id} repo={repo} />
                ))}
            </div>

            {/* GitHub Profile Link */}
            <div className="mt-6 text-center">
                <a
                    href={`https://github.com/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                    <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    View GitHub Profile
                </a>
            </div>
        </div>
    );
}

function StatCard({
    icon,
    label,
    value,
}: {
    icon: string;
    label: string;
    value: number;
}) {
    return (
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <span className="text-2xl mb-1">{icon}</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {value.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
                {label}
            </span>
        </div>
    );
}

function RepoCard({ repo }: { repo: Repository }) {
    const languageColor = repo.language
        ? languageColors[repo.language] || '#858585'
        : null;

    return (
        <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors shadow-sm hover:shadow-md"
        >
            <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-blue-600 dark:text-blue-400 truncate flex-1">
                    {repo.name}
                </h3>
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm ml-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                    </svg>
                    {repo.stargazers_count}
                </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3 min-h-[40px]">
                {repo.description || 'No description available'}
            </p>

            <div className="flex items-center justify-between text-sm">
                {repo.language && (
                    <div className="flex items-center gap-1.5">
                        <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: languageColor || '#858585' }}
                        />
                        <span className="text-gray-600 dark:text-gray-400">
                            {repo.language}
                        </span>
                    </div>
                )}

                {repo.forks_count > 0 && (
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                        </svg>
                        {repo.forks_count}
                    </div>
                )}
            </div>

            {/* Topics/Tags */}
            {repo.topics && repo.topics.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                    {repo.topics.slice(0, 3).map((topic) => (
                        <span
                            key={topic}
                            className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
                        >
                            {topic}
                        </span>
                    ))}
                </div>
            )}
        </a>
    );
}

/**
 * GitHub Contribution Graph - shows activity streak
 */
export function GitHubContributions({
    username,
    className = '',
}: {
    username: string;
    className?: string;
}) {
    return (
        <div className={`${className} text-center`}>
            <Image
                src={`https://ghchart.rshah.org/${username}`}
                alt={`${username}'s GitHub Contribution Chart`}
                width={896}
                height={128}
                className="w-full max-w-3xl mx-auto dark:invert dark:hue-rotate-180"
                unoptimized
            />
        </div>
    );
}

export default GitHubActivity;
