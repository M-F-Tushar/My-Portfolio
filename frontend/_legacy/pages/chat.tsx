import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { Send, Loader2, FileText, AlertCircle, MessageSquare, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

            <div className="min-h-screen bg-dark-950 bg-grid py-8 px-4 pt-24">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-cyan-400" />
                            </div>
                            <h1 className="text-4xl font-bold text-white">
                                Chat <span className="gradient-text">Demo</span>
                            </h1>
                        </div>
                        <p className="text-gray-400">
                            Ask questions about AI/ML concepts, this portfolio, or any of the projects.
                            Powered by RAG with source attribution.
                        </p>
                    </motion.div>

                    {/* Chat container */}
                    <motion.div
                        className="card-neon overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        {/* Messages */}
                        <div className="h-[500px] overflow-y-auto p-6 space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="text-gray-500 mb-6">
                                        <Sparkles className="w-16 h-16 mx-auto mb-4 text-cyan-500/30" />
                                        <p className="text-lg font-medium text-gray-300">Start a conversation</p>
                                        <p className="text-sm text-gray-500">Try one of these sample questions:</p>
                                    </div>
                                    <div className="space-y-2">
                                        {sampleQuestions.map((question, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setInput(question)}
                                                className="block w-full max-w-md mx-auto px-4 py-2 text-left text-sm bg-dark-800 hover:bg-dark-700 border border-dark-600 hover:border-cyan-500/30 text-gray-300 rounded-lg transition-all"
                                            >
                                                {question}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <AnimatePresence>
                                {messages.map((message, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-xl px-4 py-3 ${message.role === 'user'
                                                    ? 'bg-gradient-to-r from-cyan-600 to-electric-600 text-white'
                                                    : 'bg-dark-800 border border-dark-600 text-gray-200'
                                                }`}
                                        >
                                            <p className="whitespace-pre-wrap">{message.content}</p>

                                            {message.sources && message.sources.length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-dark-600/50">
                                                    <button
                                                        onClick={() => setShowSources(showSources === idx ? null : idx)}
                                                        className="text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors"
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
                                                                        className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
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
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-dark-800 border border-dark-600 rounded-xl px-4 py-3 flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                                        <span className="text-gray-400">Thinking...</span>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input form */}
                        <form onSubmit={handleSubmit} className="border-t border-dark-600 p-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask a question..."
                                    className="input-dark flex-1"
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
                    </motion.div>

                    {/* Info banner */}
                    <motion.div
                        className="mt-6 bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4 flex items-start gap-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <AlertCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-gray-300">
                            <p className="font-medium mb-1 text-white">Demo Mode</p>
                            <p>
                                This demo uses a small sample dataset. For production use, configure your
                                OpenRouter API key in the <code className="bg-dark-800 px-1.5 py-0.5 rounded text-cyan-400 font-mono text-xs">.env</code> file.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
