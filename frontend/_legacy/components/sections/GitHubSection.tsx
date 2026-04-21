import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Github, Star, GitFork, Users, BookOpen, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { MotionFade, StaggerContainer, StaggerItem } from '../motion/MotionWrapper';

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

interface GitHubSectionProps {
    username: string;
    maxRepos?: number;
}

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
    Jupyter: '#DA5B0B',
};

export default function GitHubSection({ username, maxRepos = 6 }: GitHubSectionProps) {
    const [repos, setRepos] = useState<Repository[]>([]);
    const [stats, setStats] = useState<GitHubStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchGitHubData() {
            try {
                setLoading(true);
                setError(null);

                const userResponse = await fetch(`https://api.github.com/users/${username}`);
                if (!userResponse.ok) throw new Error('Failed to fetch GitHub profile');
                const userData = await userResponse.json();

                const reposResponse = await fetch(
                    `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
                );
                if (!reposResponse.ok) throw new Error('Failed to fetch repositories');
                const reposData: Repository[] = await reposResponse.json();

                const totalStars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);

                setStats({
                    public_repos: userData.public_repos,
                    followers: userData.followers,
                    following: userData.following,
                    total_stars: totalStars,
                });

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

    return (
        <section id="github" className="py-24 px-4 bg-dark-950 bg-dots relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl" />
            <div className="max-w-6xl mx-auto relative z-10">
                <MotionFade>
                    <h2 className="text-4xl font-bold mb-4 text-center text-white">
                        Open <span className="gradient-text">Source</span>
                    </h2>
                    <p className="text-lg text-center text-gray-400 mb-12 max-w-xl mx-auto">
                        My contributions to the developer community
                    </p>
                </MotionFade>

                {loading && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-24 bg-dark-800 rounded-xl animate-pulse border border-dark-700" />
                            ))}
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(maxRepos)].map((_, i) => (
                                <div key={i} className="h-40 bg-dark-800 rounded-xl animate-pulse border border-dark-700" />
                            ))}
                        </div>
                    </div>
                )}

                {error && (
                    <div className="text-center py-12">
                        <p className="text-red-400 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn-secondary"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {/* GitHub Stats */}
                        {stats && (
                            <MotionFade>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
                                    <StatCard icon={<BookOpen className="w-5 h-5" />} label="Repositories" value={stats.public_repos} />
                                    <StatCard icon={<Star className="w-5 h-5" />} label="Total Stars" value={stats.total_stars} />
                                    <StatCard icon={<Users className="w-5 h-5" />} label="Followers" value={stats.followers} />
                                    <StatCard icon={<GitFork className="w-5 h-5" />} label="Following" value={stats.following} />
                                </div>
                            </MotionFade>
                        )}

                        {/* Contribution Graph */}
                        <MotionFade>
                            <div className="mb-12 card-neon p-6 overflow-hidden">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <Github className="w-5 h-5 text-cyan-400" />
                                    Contribution Activity
                                </h3>
                                <div className="overflow-x-auto">
                                    <Image
                                        src={`https://ghchart.rshah.org/06b6d4/${username}`}
                                        alt={`${username}'s GitHub Contribution Chart`}
                                        width={896}
                                        height={128}
                                        className="w-full max-w-3xl mx-auto opacity-90"
                                        unoptimized
                                    />
                                </div>
                            </div>
                        </MotionFade>

                        {/* Repository Grid */}
                        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {repos.map((repo) => (
                                <StaggerItem key={repo.id}>
                                    <RepoCard repo={repo} />
                                </StaggerItem>
                            ))}
                        </StaggerContainer>

                        {/* GitHub Profile Link */}
                        <MotionFade>
                            <div className="mt-10 text-center">
                                <a
                                    href={`https://github.com/${username}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary inline-flex items-center gap-2"
                                >
                                    <Github className="w-5 h-5" />
                                    View Full GitHub Profile
                                </a>
                            </div>
                        </MotionFade>
                    </>
                )}
            </div>
        </section>
    );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
    return (
        <motion.div
            className="card-neon p-5 text-center"
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
            <div className="flex justify-center mb-2 text-cyan-400">{icon}</div>
            <div className="text-2xl font-bold text-white font-mono">{value.toLocaleString()}</div>
            <div className="text-sm text-gray-400">{label}</div>
        </motion.div>
    );
}

function RepoCard({ repo }: { repo: Repository }) {
    const languageColor = repo.language ? languageColors[repo.language] || '#858585' : null;

    return (
        <motion.a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="card-neon p-5 block h-full"
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
            <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-cyan-400 truncate flex-1 font-mono text-sm">
                    {repo.name}
                </h3>
                <div className="flex items-center gap-1 text-gray-400 text-sm ml-2">
                    <Star className="w-3.5 h-3.5" />
                    {repo.stargazers_count}
                </div>
            </div>

            <p className="text-sm text-gray-400 line-clamp-2 mb-4 min-h-[40px]">
                {repo.description || 'No description available'}
            </p>

            <div className="flex items-center justify-between text-sm">
                {repo.language && (
                    <div className="flex items-center gap-1.5">
                        <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: languageColor || '#858585' }}
                        />
                        <span className="text-gray-500 text-xs">{repo.language}</span>
                    </div>
                )}
                {repo.forks_count > 0 && (
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <GitFork className="w-3.5 h-3.5" />
                        {repo.forks_count}
                    </div>
                )}
            </div>

            {repo.topics && repo.topics.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                    {repo.topics.slice(0, 3).map((topic) => (
                        <span key={topic} className="tech-tag text-[10px] py-0.5 px-1.5">
                            {topic}
                        </span>
                    ))}
                </div>
            )}
        </motion.a>
    );
}
