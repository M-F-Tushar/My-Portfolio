import { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { Play, Square, AlertTriangle, CheckCircle, Loader2, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AgentStep {
    step: number;
    action: string;
    result: string;
    status: 'pending' | 'running' | 'completed' | 'error';
}

export default function AgentPlayground() {
    const [isEnabled, setIsEnabled] = useState(false);
    const [task, setTask] = useState('');
    const [steps, setSteps] = useState<AgentStep[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    const handleRun = async () => {
        if (!task.trim() || isRunning || !isEnabled) return;

        setIsRunning(true);
        setSteps([]);

        try {
            const response = await axios.post('/api/agent', {
                task: task,
            });

            // Simulate step-by-step execution
            const agentSteps = response.data.steps || [];
            for (let i = 0; i < agentSteps.length; i++) {
                await new Promise((resolve) => setTimeout(resolve, 800));
                setSteps((prev) => [
                    ...prev,
                    {
                        ...agentSteps[i],
                        status: 'completed',
                    },
                ]);
            }
        } catch (error) {
            console.error('Agent error:', error);
            setSteps((prev) => [
                ...prev,
                {
                    step: prev.length + 1,
                    action: 'Error',
                    result: 'Failed to execute task',
                    status: 'error',
                },
            ]);
        } finally {
            setIsRunning(false);
        }
    };

    const handleStop = () => {
        setIsRunning(false);
    };

    const sampleTasks = [
        'Analyze the RAG system architecture',
        'List the key features of this portfolio',
        'Explain the deployment process',
    ];

    return (
        <>
            <Head>
                <title>Agent Playground - AI/ML Portfolio</title>
            </Head>

            <div className="min-h-screen bg-dark-950 bg-dots py-8 px-4 pt-24">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-violet-400" />
                            </div>
                            <h1 className="text-4xl font-bold text-white">
                                Agent <span className="gradient-text">Playground</span>
                            </h1>
                        </div>
                        <p className="text-gray-400">
                            Watch an AI agent break down complex tasks into steps and execute them sequentially.
                        </p>
                    </motion.div>

                    {/* Safety Toggle */}
                    <motion.div
                        className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.05 }}
                    >
                        <div className="flex items-start gap-3 mb-4">
                            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-white mb-2">Safety Notice</h3>
                                <p className="text-sm text-gray-400 mb-4">
                                    This agent runs in a sandboxed environment with no external access.
                                    Enable the toggle below to activate the playground.
                                </p>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={isEnabled}
                                            onChange={(e) => setIsEnabled(e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-14 h-8 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/20 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-transparent after:content-[''] after:absolute after:top-1 after:left-1 after:bg-gray-400 after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-cyan-600 peer-checked:after:bg-white"></div>
                                    </div>
                                    <span className="font-medium text-gray-300">
                                        {isEnabled ? 'Agent Enabled' : 'Agent Disabled'}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </motion.div>

                    {/* Task Input */}
                    <motion.div
                        className="card-neon p-6 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Task Description
                        </label>
                        <textarea
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                            placeholder="Describe the task you want the agent to perform..."
                            className="input-dark w-full mb-4"
                            rows={4}
                            disabled={!isEnabled || isRunning}
                        />

                        {/* Sample tasks */}
                        {!isRunning && steps.length === 0 && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-2">Try a sample task:</p>
                                <div className="flex flex-wrap gap-2">
                                    {sampleTasks.map((sample, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setTask(sample)}
                                            disabled={!isEnabled}
                                            className="tech-tag cursor-pointer hover:border-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            {sample}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Controls */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleRun}
                                disabled={!isEnabled || !task.trim() || isRunning}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Play className="w-4 h-4" />
                                Run Agent
                            </button>
                            {isRunning && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onClick={handleStop}
                                    className="btn-secondary flex items-center gap-2"
                                >
                                    <Square className="w-4 h-4" />
                                    Stop
                                </motion.button>
                            )}
                        </div>
                    </motion.div>

                    {/* Execution Steps */}
                    <AnimatePresence>
                        {steps.length > 0 && (
                            <motion.div
                                className="card-neon p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <h3 className="text-xl font-semibold text-white mb-4">Execution Steps</h3>
                                <div className="space-y-3">
                                    {steps.map((step, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="border border-dark-600 rounded-xl p-4 flex gap-4 bg-dark-800/50"
                                        >
                                            <div className="flex-shrink-0 mt-0.5">
                                                {step.status === 'completed' && (
                                                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                                                )}
                                                {step.status === 'running' && (
                                                    <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                                                )}
                                                {step.status === 'error' && (
                                                    <AlertTriangle className="w-5 h-5 text-red-400" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-mono text-gray-500">
                                                        Step {step.step}
                                                    </span>
                                                    <span className="text-sm font-semibold text-white">
                                                        {step.action}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-400">{step.result}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
}
