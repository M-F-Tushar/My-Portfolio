/**
 * Blog Post Detail Page
 * 
 * Displays a single blog post with full content.
 */

import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowLeft, Share2, Twitter, Linkedin, Copy } from 'lucide-react';
import prisma from '@/lib/prisma';
import SEO from '@/components/SEO';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import { generateArticleSchema, generateBreadcrumbSchema, combineSchemas } from '@/lib/structuredData';
import { siteConfig, getFullUrl } from '@/lib/config';
import { useState } from 'react';

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string | null;
    tags: string;
    publishedAt: string | null;
    readTime: number;
    updatedAt: string;
}

interface BlogPostPageProps {
    post: BlogPost | null;
}

export const getStaticPaths: GetStaticPaths = async () => {
    try {
        const posts = await prisma.blogPost.findMany({
            where: { published: true },
            select: { slug: true },
        });

        return {
            paths: posts.map((post: { slug: string }) => ({ params: { slug: post.slug } })),
            fallback: 'blocking',
        };
    } catch {
        return {
            paths: [],
            fallback: 'blocking',
        };
    }
};

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({ params }) => {
    const slug = params?.slug as string;

    try {
        const post = await prisma.blogPost.findUnique({
            where: { slug },
        });

        if (!post || !post.published) {
            return { notFound: true };
        }

        return {
            props: {
                post: JSON.parse(JSON.stringify(post)),
            },
            revalidate: 60,
        };
    } catch {
        return { notFound: true };
    }
};

function formatDate(dateString: string | null): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default function BlogPostPage({ post }: BlogPostPageProps) {
    const [copied, setCopied] = useState(false);

    if (!post) {
        return null;
    }

    const tags = JSON.parse(post.tags || '[]') as string[];
    const postUrl = getFullUrl(`/blog/${post.slug}`);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(postUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const shareOnTwitter = () => {
        const text = encodeURIComponent(`${post.title} by @${siteConfig.twitterHandle || 'author'}`);
        const url = encodeURIComponent(postUrl);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    };

    const shareOnLinkedIn = () => {
        const url = encodeURIComponent(postUrl);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    };

    // Structured Data
    const articleSchema = generateArticleSchema({
        title: post.title,
        description: post.excerpt,
        image: post.coverImage || undefined,
        datePublished: post.publishedAt || post.updatedAt,
        dateModified: post.updatedAt,
        author: siteConfig.author,
        url: postUrl,
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: post.title, url: `/blog/${post.slug}` },
    ]);

    return (
        <>
            <SEO
                title={post.title}
                description={post.excerpt}
                image={post.coverImage || undefined}
                url={`/blog/${post.slug}`}
                type="article"
                publishedTime={post.publishedAt || undefined}
                modifiedTime={post.updatedAt}
            />

            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: combineSchemas(articleSchema, breadcrumbSchema),
                }}
            />

            <article className="min-h-screen bg-white dark:bg-gray-900">
                {/* Header */}
                <header className="bg-gray-50 dark:bg-gray-800 py-12 px-4">
                    <div className="max-w-3xl mx-auto">
                        {/* Back Link */}
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-8"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Blog
                        </Link>

                        <ScrollAnimation animation="fadeIn">
                            {/* Tags */}
                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Title */}
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                                {post.title}
                            </h1>

                            {/* Meta */}
                            <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400">
                                {post.publishedAt && (
                                    <span className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5" />
                                        {formatDate(post.publishedAt)}
                                    </span>
                                )}
                                <span className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    {post.readTime} min read
                                </span>
                            </div>
                        </ScrollAnimation>
                    </div>
                </header>

                {/* Cover Image */}
                {post.coverImage && (
                    <div className="relative w-full max-w-4xl mx-auto -mt-4">
                        <div className="aspect-video relative rounded-xl overflow-hidden shadow-2xl mx-4">
                            <Image
                                src={post.coverImage}
                                alt={post.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="max-w-3xl mx-auto px-4 py-12">
                    <ScrollAnimation animation="fadeIn">
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <MarkdownRenderer content={post.content} />
                        </div>
                    </ScrollAnimation>

                    {/* Share */}
                    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">
                                Share this article:
                            </span>
                            <div className="flex gap-3">
                                <button
                                    onClick={shareOnTwitter}
                                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                                    aria-label="Share on Twitter"
                                >
                                    <Twitter className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={shareOnLinkedIn}
                                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
                                    aria-label="Share on LinkedIn"
                                >
                                    <Linkedin className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleCopyLink}
                                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900/30 text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors"
                                    aria-label="Copy link"
                                >
                                    {copied ? (
                                        <span className="text-green-600 text-sm font-medium">Copied!</span>
                                    ) : (
                                        <Copy className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </>
    );
}
