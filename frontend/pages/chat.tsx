import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { Send, Loader2, FileText, AlertCircle } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    sources?: Array<{ title: string; url: string }>;
}

export default function ChatDemo() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSources, setShowSources] = useState<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post('/api/chat', {
                message: input,
                conversationHistory: messages,
            });

            const assistantMessage: Message = {
                role: 'assistant',
                content: response.data.response,
                sources: response.data.sources || [],
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const sampleQuestions = [
        'What is RAG and how does it work?',
        'Explain the architecture of this portfolio',
        'How do I deploy this to Vercel?',
    ];

    return (
        <>
            <Head>
                <title>Chat Demo - AI/ML Portfolio</title>
            </Head>

            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-4">
                            Chat <span className="gradient-text">Demo</span>
                        </h1>
                        <p className="text-gray-600">
                            Ask questions about AI/ML concepts, this portfolio, or any of the projects.
                            Powered by RAG with source attribution.
                        </p>
                    </div>

                    {/* Chat container */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        {/* Messages */}
                        <div className="h-[500px] overflow-y-auto p-6 space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 mb-6">
                                        <FileText className="w-16 h-16 mx-auto mb-4" />
                                        <p className="text-lg font-medium">Start a conversation</p>
                                        <p className="text-sm">Try one of these sample questions:</p>
                                    </div>
                                    <div className="space-y-2">
                                        {sampleQuestions.map((question, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setInput(question)}
                                                className="block w-full max-w-md mx-auto px-4 py-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                {question}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages.map((message, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg px-4 py-3 ${message.role === 'user'
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-gray-100 text-gray-900'
                                            }`}
                                    >
                                        <p className="whitespace-pre-wrap">{message.content}</p>

                                        {message.sources && message.sources.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-gray-300">
                                                <button
                                                    onClick={() => setShowSources(showSources === idx ? null : idx)}
                                                    className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    {showSources === idx ? 'Hide' : 'Show'} Sources ({message.sources.length})
                                                </button>

                                                {showSources === idx && (
                                                    <ul className="mt-2 space-y-1">
                                                        {message.sources.map((source, sourceIdx) => (
                                                            <li key={sourceIdx}>
                                                                <a
                                                                    href={source.url}
                                                                    className="text-sm text-primary-600 hover:underline"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    {source.title}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 rounded-lg px-4 py-3 flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="text-gray-600">Thinking...</span>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input form */}
                        <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask a question..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    Send
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Info banner */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900">
                            <p className="font-medium mb-1">Demo Mode</p>
                            <p>
                                This demo uses a small sample dataset. For production use, configure your
                                OpenRouter API key in the <code className="bg-blue-100 px-1 rounded">.env</code> file.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
