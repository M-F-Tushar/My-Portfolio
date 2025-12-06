/**
 * Blog Index Page
 * 
 * Lists all published blog posts with filtering and search.
 */

import { GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react';
import prisma from '@/lib/prisma';
import SEO from '@/components/SEO';
import { ScrollAnimation } from '@/components/ScrollAnimation';

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string | null;
    tags: string;
    publishedAt: string | null;
    readTime: number;
}

interface BlogIndexProps {
    posts: BlogPost[];
}

export const getStaticProps: GetStaticProps<BlogIndexProps> = async () => {
    try {
        const posts = await prisma.blogPost.findMany({
            where: { published: true },
            orderBy: { publishedAt: 'desc' },
            select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                coverImage: true,
                tags: true,
                publishedAt: true,
                readTime: true,
            },
        });

        return {
            props: {
                posts: JSON.parse(JSON.stringify(posts)),
            },
            revalidate: 60,
        };
    } catch (error) {
        // If BlogPost table doesn't exist yet, return empty array
        console.log('Blog posts not available. Run: npx prisma generate && npx prisma db push');
        return {
            props: {
                posts: [],
            },
            revalidate: 60,
        };
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

export default function BlogIndex({ posts }: BlogIndexProps) {
    return (
        <>
            <SEO
                title="Blog | AI/ML Portfolio"
                description="Technical articles about AI, Machine Learning, and software development."
                url="/blog"
            />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <ScrollAnimation animation="fadeIn">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                <span className="gradient-text">Blog</span>
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400">
                                Thoughts on AI, ML, and building intelligent systems
                            </p>
                        </div>
                    </ScrollAnimation>

                    {/* Posts Grid */}
                    {posts.length > 0 ? (
                        <div className="space-y-8">
                            {posts.map((post, index) => {
                                const tags = JSON.parse(post.tags || '[]') as string[];
                                
                                return (
                                    <ScrollAnimation key={post.id} animation="slideUp" delay={index * 100}>
                                        <article className="card overflow-hidden group">
                                            <div className="md:flex">
                                                {/* Cover Image */}
                                                {post.coverImage && (
                                                    <div className="md:w-1/3 relative aspect-video md:aspect-auto">
                                                        <Image
                                                            src={post.coverImage}
                                                            alt={post.title}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    </div>
                                                )}
                                                
                                                {/* Content */}
                                                <div className={`p-6 ${post.coverImage ? 'md:w-2/3' : 'w-full'}`}>
                                                    {/* Meta */}
                                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                                        {post.publishedAt && (
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-4 h-4" />
                                                                {formatDate(post.publishedAt)}
                                                            </span>
                                                        )}
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {post.readTime} min read
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Title */}
                                                    <Link href={`/blog/${post.slug}`}>
                                                        <h2 className="text-2xl font-bold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                            {post.title}
                                                        </h2>
                                                    </Link>
                                                    
                                                    {/* Excerpt */}
                                                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                                        {post.excerpt}
                                                    </p>
                                                    
                                                    {/* Tags */}
                                                    {tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mb-4">
                                                            {tags.map(tag => (
                                                                <span
                                                                    key={tag}
                                                                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                    
                                                    {/* Read More */}
                                                    <Link
                                                        href={`/blog/${post.slug}`}
                                                        className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:gap-3 transition-all"
                                                    >
                                                        Read More
                                                        <ArrowRight className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </article>
                                    </ScrollAnimation>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">📝</div>
                            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                                No posts yet
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Check back soon for new articles!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
