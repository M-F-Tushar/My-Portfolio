import { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { Play, Square, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

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

            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-4">
                            Agent <span className="gradient-text">Playground</span>
                        </h1>
                        <p className="text-gray-600">
                            Watch an AI agent break down complex tasks into steps and execute them sequentially.
                        </p>
                    </div>

                    {/* Safety Toggle */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                        <div className="flex items-start gap-3 mb-4">
                            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-yellow-900 mb-2">Safety Notice</h3>
                                <p className="text-sm text-yellow-800 mb-4">
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
                                        <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                                    </div>
                                    <span className="font-medium text-yellow-900">
                                        {isEnabled ? 'Agent Enabled' : 'Agent Disabled'}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Task Input */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Task Description
                        </label>
                        <textarea
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                            placeholder="Describe the task you want the agent to perform..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
                            rows={4}
                            disabled={!isEnabled || isRunning}
                        />

                        {/* Sample tasks */}
                        {!isRunning && steps.length === 0 && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">Try a sample task:</p>
                                <div className="flex flex-wrap gap-2">
                                    {sampleTasks.map((sample, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setTask(sample)}
                                            disabled={!isEnabled}
                                            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
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
                                <button
                                    onClick={handleStop}
                                    className="btn-secondary flex items-center gap-2"
                                >
                                    <Square className="w-4 h-4" />
                                    Stop
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Execution Steps */}
                    {steps.length > 0 && (
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-xl font-semibold mb-4">Execution Steps</h3>
                            <div className="space-y-4">
                                {steps.map((step, idx) => (
                                    <div
                                        key={idx}
                                        className="border border-gray-200 rounded-lg p-4 flex gap-4"
                                    >
                                        <div className="flex-shrink-0">
                                            {step.status === 'completed' && (
                                                <CheckCircle className="w-6 h-6 text-green-600" />
                                            )}
                                            {step.status === 'running' && (
                                                <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
                                            )}
                                            {step.status === 'error' && (
                                                <AlertTriangle className="w-6 h-6 text-red-600" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-sm font-medium text-gray-500">
                                                    Step {step.step}
                                                </span>
                                                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                    {step.action}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">{step.result}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
