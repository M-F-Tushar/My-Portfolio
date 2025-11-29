import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
    content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
    const mermaidRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose',
        });

        const renderMermaid = async () => {
            if (mermaidRef.current) {
                const mermaidDivs = mermaidRef.current.querySelectorAll('.mermaid');
                for (let index = 0; index < mermaidDivs.length; index++) {
                    const div = mermaidDivs[index];
                    try {
                        const { svg } = await mermaid.render(`mermaid-${index}`, div.textContent || '');
                        div.innerHTML = svg;
                    } catch (error) {
                        console.error('Mermaid rendering error:', error);
                    }
                }
            }
        };

        renderMermaid();
    }, [content]);

    return (
        <div ref={mermaidRef} className="prose prose-lg max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex, rehypeHighlight]}
                components={{
                    // Custom heading with anchor links
                    h1: ({ node, ...props }) => (
                        <h1 className="text-4xl font-bold mt-8 mb-4 text-gray-900" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                        <h2 className="text-3xl font-semibold mt-6 mb-3 text-gray-900" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                        <h3 className="text-2xl font-semibold mt-4 mb-2 text-gray-900" {...props} />
                    ),

                    // Custom code blocks
                    code: ({ node, className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const language = match ? match[1] : '';

                        // Render mermaid diagrams
                        if (language === 'mermaid') {
                            return (
                                <div className="mermaid my-8">
                                    {String(children).replace(/\n$/, '')}
                                </div>
                            );
                        }

                        // Default code rendering (inline or block)
                        return (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },

                    // Custom links
                    a: ({ node, ...props }) => (
                        <a
                            className="text-primary-600 hover:text-primary-700 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                        />
                    ),

                    // Custom blockquotes
                    blockquote: ({ node, ...props }) => (
                        <blockquote
                            className="border-l-4 border-primary-500 pl-4 py-2 my-4 italic text-gray-700 bg-primary-50 rounded-r"
                            {...props}
                        />
                    ),

                    // Custom tables
                    table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-6">
                            <table className="min-w-full divide-y divide-gray-200" {...props} />
                        </div>
                    ),
                    th: ({ node, ...props }) => (
                        <th className="px-4 py-2 bg-gray-100 text-left text-sm font-semibold text-gray-900" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                        <td className="px-4 py-2 border-t border-gray-200 text-sm text-gray-700" {...props} />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
